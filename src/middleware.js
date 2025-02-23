const jwt = require("jsonwebtoken");
const SECRETKEY = "Don't Share With Anyone";

const verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.sendStatus(403).json({
      message: "Token Not Found",
    });
  }
  if(req.path === '/register' || req.path === '/login'){
    next();
    return;
  }
  
  const beartoken = bearer.split(" ")[1];
  jwt.verify(beartoken, SECRETKEY, (err, data) => {
    if (err) {
      res.sendStatus(402).json({
        message: "Token Expires",
      });
      return;
    }

    req.userData = data;
    next();
  });
};

module.exports = verifyToken;
