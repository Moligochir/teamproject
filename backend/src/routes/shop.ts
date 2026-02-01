import express from "express";
import { getProducts } from "../resolvers/shop/shop-get";
import { CreateProduct } from "../resolvers/shop/shop-create";
export const Shop = express.Router();

Shop.get("/", getProducts);
Shop.post("/", CreateProduct);
