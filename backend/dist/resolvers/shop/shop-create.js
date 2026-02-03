"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = void 0;
const model_shop_1 = require("../../models/model-shop");
const CreateProduct = async (req, res) => {
    const newProduct = req.body;
    try {
        const dbProduct = await model_shop_1.ProductModel.create({
            ProductName: newProduct.ProductName,
            ImageURL: newProduct.ImageURL,
            Price: newProduct.Price,
            PhoneNumber: newProduct.PhoneNumber,
        });
        res.status(200).json({ message: "success", data: dbProduct });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
        console.log(e);
    }
};
exports.CreateProduct = CreateProduct;
