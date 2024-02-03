// Middleware for handling auth
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.Authorization;
    let mainToken = token.split(" ");
    const jwtToken = mainToken[1];

    try{
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        if(!decoded.username){
            res.status(403).json({
                msg: "Invalid token ! you are not Authenticated"
            });
        } else{
            next();
        }
    } catch(e){
        res.json({
            msg: "incorrect Input"
        });
    }
}

module.exports = adminMiddleware;