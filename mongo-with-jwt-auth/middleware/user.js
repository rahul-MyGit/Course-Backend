const {JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    let token = req.headers.Authorization.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch(e){
        res.status(403).json({
            msg : " Invalid creadentials !! you are not authorized"
        });
        return
    }
}

module.exports = userMiddleware;