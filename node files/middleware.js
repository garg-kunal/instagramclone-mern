const jwt=require('jsonwebtoken')
const SECRETKEY="Don't Share With Anyone";


const verifyToken = (req, res, next) => {
 const bearer = req.headers.authorization;
    if (bearer) {
        const beartoken = bearer.split(" ")[1];
        jwt.verify(beartoken, SECRETKEY, (err, data) => {
            if (err) {
                return res.sendStatus(402).json({
                    message:"Token Expires"
                })
            } else {
                req.userData = data;
                next();
            }

        })
    }
    else {
        return res.sendStatus(403).json({
            message:"Token Not Found"
        })
    }

}

module.exports=verifyToken