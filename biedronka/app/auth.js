import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";


async function refreshAccessToken(token) {
    const resp = await fetch("http://keycloak-biedronka:8080/realms/biedronka/protocol/openid-connect/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "biedronkaClient",
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      }),
      method: "POST",
    });
    const refreshToken = await resp.json();
    if (!resp.ok) throw refreshToken;
  
    return {
      ...token,
      access_token: refreshToken.access_token,
      decoded: jwtDecode(refreshToken.access_token),
      id_token: refreshToken.id_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
      refresh_token: refreshToken.refresh_token,
    };
  }

export const authOptions = {
    providers: [
        Keycloak({
            clientId: "biedronkaClient",
            clientSecret: process.env.CLIENT_SECRET,
            issuer: "http://localhost:8080/realms/biedronka",
            token: "http://keycloak-biedronka:8080/realms/biedronka/protocol/openid-connect/token",
            authorization: "http://localhost:8080/realms/biedronka/protocol/openid-connect/auth",
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
          const nowTimeStamp = Math.floor(Date.now() / 1000);
    
          if (account) {
            // account is only available the first time this callback is called on a new session (after the user signs in)
            token.decoded = jwtDecode(account.access_token);
            token.access_token = account.access_token;
            token.id_token = account.id_token;
            token.expires_at = account.expires_at;
            token.refresh_token = account.refresh_token;
            return token;
          } else if (nowTimeStamp < token.expires_at) {
            // token has not expired yet, return it
            return token;
          } else {
            // token is expired, try to refresh it
            console.log("Token has expired. Will refresh...")
            try {
              const refreshedToken = await refreshAccessToken(token);
              console.log("Token is refreshed.")
              return refreshedToken;
            } catch (error) {
              console.error("Error refreshing access token", error);
              return { ...token, error: "RefreshAccessTokenError" };
            }
          }
        },
        async session({ session, token }) {
          session.access_token = token.access_token;
          session.id_token = token.id_token;
          session.roles = token.decoded.realm_access.roles;
          return session;
        },
      },
      events: {
        async signOut({ token, session }) {
          token = {};
          session = {};
        },
      },
}

export const {handlers, signIn, signOut, auth} = NextAuth(authOptions);
