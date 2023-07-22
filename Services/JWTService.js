const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET} = require('../Config/configuration');
// const RefreshToken = require('../Model/token');

class JWTService{
    // sign access token
    static signAccessToken (payload,expiryTime,secret = ACCESS_TOKEN_SECRET){
        console.log(secret,"here wegoooooooo");
        return jwt.sign(payload,secret,{expiresIn :expiryTime});
    }

    // sign refresh token
    static signRefreshToken (payload,expiryTime,secret = REFRESH_TOKEN_SECRET){
        return jwt.sign(payload,secret,{expiresIn :expiryTime});
    }

    // verify access token 
    static verifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOKEN_SECRET);
    }

    // verify refresh token 
    static verifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOKEN_SECRET);
    }

    // store in db 
    static async storeRefreshToken (token,userId){
        try {
            
            const newToken = new RefreshToken({
                token:token, 
                userId:userId
            });

            // store in db 
            await newToken.save();


        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = JWTService;