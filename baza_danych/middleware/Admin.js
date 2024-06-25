const isAdmin = async (req, res, next) => {
    try {
      const roles = req.token?.realm_access?.roles || [];
      if (roles.includes("admin")) {
        next();
      } else {
        return res.status(403).send("Forbidden: User does not have admin role.");
      }
    } catch (err) {
      return res.status(401).send("Unauthorized: Role verification failed.");
    }
  };
  
module.exports = isAdmin 