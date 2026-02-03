"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adopt = void 0;
const express_1 = __importDefault(require("express"));
const get_adopt_1 = require("../resolvers/adopt/get-adopt");
const create_adopt_1 = require("../resolvers/adopt/create-adopt");
exports.Adopt = express_1.default.Router();
exports.Adopt.post("/", create_adopt_1.CreateAdopt);
exports.Adopt.get("/", get_adopt_1.getAdopt);
