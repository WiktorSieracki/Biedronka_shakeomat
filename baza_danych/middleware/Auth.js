const jwt = require('jsonwebtoken');
require('dotenv').config();


const publicKey = process.env.PUBLIC_KEY;

const isAuthenticated = async (
  req,
  res,
  next,
) => {
  try {
    if (!publicKey || publicKey === "null") {
      console.error("Public key is not set or invalid.");
      return res.status(500).send("Server error: public key not set.");
    }

    const bearer = req.headers.authorization;
    if (!bearer) {
      console.error("Authorization header is missing.");
      return res
        .status(401)
        .send("Unauthorized: Authorization header missing.");
    }

    const token = bearer.split(" ")[1];
    console.log("token", token);
    if (!token) {
      console.error("Bearer token is missing.");
      return res.status(403).send("Forbidden: Bearer token missing.");
    }

    const decoded = jwt.verify(
      token,
      `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      { algorithms: ["RS256"] }
    );
    req.token = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).send("Unauthorized: Token verification failed.");
  }
};

module.exports = isAuthenticated;