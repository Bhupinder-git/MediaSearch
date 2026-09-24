// Importing jwt
const jwt = require('jsonwebtoken');

// importing environment variables
require('dotenv').config();

// middleware to check authentication
function authentication(req, res, next){
    const token = req?.cookies?.token;
    if(!token)
        return res.status(401).json({
            success : false,
            message : "Login again."
        });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch{
        return res.status(401).json({
            success : false,
            message : "Invalid token."
        });
    }
}

// exporting middleware
module.exports = authentication;