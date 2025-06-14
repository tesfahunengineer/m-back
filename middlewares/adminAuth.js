const jwt = require("jsonwebtoken");

function adminAuthMiddleware(req, res, next){
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({ message: "Forbidden" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log(err);
        if(err){
            return res.status(403).json({ message: "Invalid token" });
        }
        if(decoded.role !== "Admin"){
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    });
}

module.exports = adminAuthMiddleware;
