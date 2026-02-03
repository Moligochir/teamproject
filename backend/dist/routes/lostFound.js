"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostFound = void 0;
const express_1 = __importDefault(require("express"));
const create_LostFound_1 = require("../resolvers/LostFound/create-LostFound");
const get_LostFound_1 = require("../resolvers/LostFound/get-LostFound");
const findid_lostFound_1 = require("../resolvers/LostFound/findid-lostFound");
const delete_LostFound_1 = require("../resolvers/LostFound/delete-LostFound");
const put_LostFound_1 = require("../resolvers/LostFound/put-LostFound");
exports.LostFound = express_1.default.Router();
exports.LostFound.get("/findid/:id", findid_lostFound_1.FindIdLostFound);
exports.LostFound.post("/", create_LostFound_1.createLostFound);
exports.LostFound.get("/", get_LostFound_1.getLostFound);
exports.LostFound.delete("/:id", delete_LostFound_1.deleteLostFound);
exports.LostFound.put("/:id", put_LostFound_1.putLostFound);
