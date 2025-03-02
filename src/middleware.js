const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  if (req.path === "/register" || req.path === "/login") {
    return next();
  }

  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Token Not Found",
      code: "token_not_found",
    });
  }

  const token = bearer.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Invalid Token Format" });
  }

  jwt.verify(token, SECRETKEY, (err, data) => {
    if (err) {
      return res.status(401).json({
        message: "Token Expired or Invalid",
        code: "token_invalid",
      });
    }

    req.userData = data;
    next();
  });
};

module.exports = verifyToken;
