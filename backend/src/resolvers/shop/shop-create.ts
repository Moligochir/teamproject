import { Request, Response } from "express";
import { ProductModel } from "../../models/model-shop";

export const CreateProduct = async (req: Request, res: Response) => {
  const newProduct = req.body;
  try {
    const dbProduct = await ProductModel.create({
      ProductName: newProduct.ProductName,
      ImageURL: newProduct.ImageURL,
      Price: newProduct.Price,
      PhoneNumber: newProduct.PhoneNumber,
    });
    res.status(200).json({ message: "success", data: dbProduct });
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
