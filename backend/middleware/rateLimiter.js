import ratelimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) =>{
    try {
        // in a real world app we need to put the user id or ipaddress as your key 
        const {success} = await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message: "too many request, please try again later",
            });
        }
        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
};

export default rateLimiter