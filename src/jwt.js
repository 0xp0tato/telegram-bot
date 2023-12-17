const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

// Function to verify a JWT token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];

  console.log(token);

  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, verifyToken };
