"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shop = void 0;
const express_1 = __importDefault(require("express"));
const shop_get_1 = require("../resolvers/shop/shop-get");
const shop_create_1 = require("../resolvers/shop/shop-create");
exports.Shop = express_1.default.Router();
exports.Shop.get("/", shop_get_1.getProducts);
exports.Shop.post("/", shop_create_1.CreateProduct);
