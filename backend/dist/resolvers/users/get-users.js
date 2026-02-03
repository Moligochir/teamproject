"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const model_user_1 = require("../../models/model-user");
const getUsers = async (req, res) => {
    const dbUsers = await model_user_1.UserModel.find();
    console.log(dbUsers);
    res.status(200).json(dbUsers);
};
exports.getUsers = getUsers;
