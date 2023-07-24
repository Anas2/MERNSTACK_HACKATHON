// const UserModel = require('../Model/userModel');
// const { sendResponse } = require('../Helper/helper');

// const bcrypt = require('bcryptjs');
// const jwtToken = require('jsonwebtoken');


const Joi = require('joi');
const User = require('../Model/userModel');
const bcrypt = require('bcrypt');
const JWTService = require('../Services/JWTService');
const UserDto = require('../Dto/userDto');
const { BACKEND_SERVER_PATH } = require('../Config/configuration');
const fs = require('fs');



const passwordPattern = /.*[A-Z].*\d+.*[!@#$%^&*()_+=<>?]+.*/;


const authController = {

    // register user 
    async register(req, res, next) {
        // try {

        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password'),
            photo: Joi.string()
        });


        const { error } = userRegisterSchema.validate(req.body);

        if (error) {
            console.log(error);
            return next(error)
        }

        const { username, email, password, photo } = req.body;

        // if user already return with error msg 

        try {
            const alreadyExist = await User.exists({ email });
            if (alreadyExist) {
                const error = {
                    message: "email already exist, use another email",
                    status: 400
                }
                return next(error);
            }

        } catch (error) {
            return next(error)
        }

        // user password hash

        const hashPassword = await bcrypt.hash(password, 10)

        // let hashPassword = await bcrypt.hash(obj.password, 10);

        // Image Steps Start
        console.log(photo, "here is photo");
        const replacedImg = photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

        // read as buffer 
        const buffer = Buffer.from(replacedImg, 'base64');

        // allot a random name
        let randomNum = Math.round(Math.random() * 100000);
        const imagePath = `${Date.now()}-${randomNum}.png`;

        // save locally
        try {
            fs.writeFileSync(`Storage/${imagePath}`, buffer);

        } catch (error) {
            return next(error);
        }

        // Image Steps Ends

        let user;

        try {
            const userRegistered = new User({
                username: username,
                email: email,
                password: hashPassword,
                photo: `${BACKEND_SERVER_PATH}/storage/${imagePath}`
            })

            user = await userRegistered.save();

            // Token Generation 
            accessToken = JWTService.signAccessToken({ id: user._id }, "60m");
            console.log(accessToken);

        } catch (error) {
            return next(error);
        }

        // send response

        const userDto = new UserDto(user)
        return res.status(201).json({ user: userDto, accessToken, auth: true })

















































        // password = hashPassword;

        // const existingUser = await UserModel.findOne({ email });
        // console.log(existingUser, "aa");
        // if (existingUser) {
        //     res.send(sendResponse(false, null, "user already exist...")).status(403);
        // } else {
        //     UserModel.create(obj).then((result) => {
        //         console.log(obj, result);
        //         res.send(sendResponse(true, result, "User Saved Successfully"));

        //     }).catch((err) => {
        //         res.send(sendResponse(false, err, "Internal Server Error")).status(400);
        //     });
        // }





        // } catch (error) {

        // }

    },

    // login user 
    async login(req, res, next) {


        const userLoginSchema = Joi.object({
            email: Joi.string().min(5).max(30).email().required(),
            password: Joi.string().pattern(passwordPattern).required()
        })

        const { error } = userLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        let user;

        try {

            const { email, password } = req.body

            user = await User.findOne({ email: email });

            if (!user) {
                const err = {
                    message: " invalid username or password ",
                    status: 401
                }
                return next(err)
            }

            const compairePassword = await bcrypt.compare(password, user.password);

            if (!compairePassword) {
                const err = {
                    message: " invalid username or password ",
                    status: 401
                }
                return next(err);
            }

        } catch (error) {
            return next(error)
        }

        const accessToken = JWTService.signAccessToken({ _id: user._id }, '60m');


        const userDto = new UserDto(user)
        return res.status(200).json({ user: userDto, accessToken, auth: true })



        // try {
        // const { email, password } = req.body;
        // const obj = { email, password };
        // console.log(req);
        // let result = await UserModel.findOne({ email });

        // if (result) {
        //     let isConfirmed = await bcrypt.compare(obj.password, result.password);
        //     if (isConfirmed) {

        //         let token = jwtToken.sign({ result }, process.env.SECRET_KEY, {
        //             expiresIn: "24h",
        //         })

        //         res.send(sendResponse(true, { result, token }, "Login Successfully")).status(200);

        //     } else {
        //         res.send(sendResponse(false, null, "Invalid username or password")).status(403)

        //     }
        // } else {
        //     res.send(sendResponse(false, null, "User Doesn't Exist")).status(403)

        // }
        // } catch (error) {
        //     res.send(sendResponse(false, null, "data not found")).status(404);

        // }
    },

    // update Password 
    async updatePassword(req, res, next) {

        const userLoginSchema = Joi.object({
            _id: Joi.string().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            newPassword: Joi.string().pattern(passwordPattern).required()
        })

        const { error } = userLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        let user;

        const { _id, password, newPassword } = req.body
        try {


            user = await User.findOne({ _id: _id });

            if (!user) {
                const err = {
                    message: " invalid username or password ",
                    status: 401
                }
                return next(err)
            }

            if (password == newPassword) {
                const err = {
                    message: " Current & New Password Should Not be Same ",
                    status: 401
                }
                return next(err)
            }

            const compairePassword = await bcrypt.compare(password, user.password);

            console.log("old pass", compairePassword);
            if (!compairePassword) {
                const err = {
                    message: " invalid password ",
                    status: 401
                }
                return next(err);
            }

        } catch (error) {
            return next(error)
        }


        try {

            const hashPassword = await bcrypt.hash(newPassword, 10);

            user = await User.findOne({ _id: _id });

            user.password = hashPassword;

            const result = await user.save();

        } catch (error) {
            return next(error);
        }




        const userDto = new UserDto(user);
        return res.status(200).json({ user: userDto, message: "Password Successfully Updated" });


    },

    async updateUsername(req, res, next) {

        const updateUsernameSchema = Joi.object({
            _id: Joi.string().required(),
            username: Joi.string().required(),
        })

        const { error } = updateUsernameSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        let user;

        const { _id, username } = req.body
        try {


            user = await User.findOne({ _id: _id });

            if (!user) {
                const err = {
                    message: " invalid user ",
                    status: 401
                }
                return next(err)
            }

            try {

                user = await User.findOne({ _id: _id });

                user.username = username;

                const result = await user.save();

            } catch (error) {
                return next(error);
            }


            const userDto = new UserDto(user);
            return res.status(200).json({ user: userDto, message: "Username Successfully Updated " });


        } catch (error) {
            return next(error);
        }




        // getUsers: async (req, res) => {
        //     UserModel.find().then((result) => {
        //         res.send(sendResponse(true, result));
        //     }).catch((err) => { });
        // },
        // protected: async (req, res, next) => {
        //     let token = req.headers.authorization;
        //     console.log(token);
        //     if (token) {
        //         token = token.split(" ")[1];

        //         jwtToken.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        //             if (err) {
        //                 res.send(sendResponse(false, null, "Unauthorized")).status(403);
        //             } else {
        //                 console.log(decoded, "here we gooo");
        //                 next();
        //             }
        //         })
        //     } else {

        //         res.send(sendResponse(false, null, "Unauthorized")).status(403);
        //     }
        // },

    }
}


module.exports = authController;
