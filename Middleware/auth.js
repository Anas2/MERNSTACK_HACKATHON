const JWTService = require('../Services/JWTService');
const UserMode = require('../Model/userModel')
const UserDto = require('../Dto/userDto');
const auth = async (req, res, next) => {

    try {
        console.log("kkkk");
        // 1 refresh, access token validattion
        let accessToken = req.headers.authorization;

        if (!accessToken) {
            let err = {
                status: 401,
                message: "Unauthorized"
            }
            return next(err);
        }

        let _id;
        try {
            _id = JWTService.verifyAccessToken(accessToken);

            // JWTService.verifyRefreshToken(refreshToken);

        } catch (error) {

            return next(error);

        }
        let user;
        try {
            user = await UserMode.findOne({ _id: _id });
        } catch (error) {
            return next(error);
        }

        const userDto = new UserDto(user);

        req.user = userDto;

        next();

    } catch (error) {
        
        return next(error);
    }
}

module.exports = auth;