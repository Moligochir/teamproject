"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const model_shop_1 = require("../../models/model-shop");
const getProducts = async (req, res) => {
    const dbProducts = await model_shop_1.ProductModel.find();
    res.status(200).json(dbProducts);
};
exports.getProducts = getProducts;
