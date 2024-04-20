const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user == null || user._id == null) return res.sendStatus(403);
    req.logged_in_user_id = user._id;
    next();
  });
}

module.exports = {
  authenticateToken,
};
