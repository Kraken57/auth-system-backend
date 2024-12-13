const jwt = require("jsonwebtoken");
const JWT_SECRET = ""; //Require a JWT SECRET

function auth(req, res, next) {
  const token = req.headers.token;
  const decodeInfo = jwt.decode(token, JWT_SECRET);

  if (decodeInfo) {
    req.userId = decodeInfo.id;
    next();
  } else {
    res.status(403).json({
      message: "Invalid credentials",
    });
  }
}

module.exports = {
    auth, 
    JWT_SECRET
}