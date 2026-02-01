import { Request, Response } from "express";
import { ProductModel } from "../../models/model-shop";

export const getProducts = async (req: Request, res: Response) => {
  const dbProducts = await ProductModel.find();

  res.status(200).json(dbProducts);
};
