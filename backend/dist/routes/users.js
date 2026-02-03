"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const express_1 = __importDefault(require("express"));
const get_users_1 = require("../resolvers/users/get-users");
const create_users_1 = require("../resolvers/users/create-users");
exports.User = express_1.default.Router();
exports.User.get("/", get_users_1.getUsers);
exports.User.post("/", create_users_1.CreateUser);
