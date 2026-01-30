import { ShopModel } from "../../models/model-shop";
import { Request, Response } from "express";
export const getShop = async (req: Request, res: Response) => {
  try {
    const dbShop = await ShopModel.find().sort({ createdAt: -1 });

    res.status(200).json({ message: "success", data: dbShop });
  } catch (e: unknown) {
    console.log(e);
    res.status(500).json({ message: (e as Error).message });
  }
};
