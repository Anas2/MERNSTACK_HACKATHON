const joi = require('joi');
const testModel = require('../Model/test.Model');
const UserModel = require('../Model/userModel');

const testController = {

    async getUsers(req, res) {
        UserModel.find().then((result) => {
            res.json({data:result}).status(200);
        }).catch((err) => {
            next(err)
         });
    },

}


module.exports = testController;