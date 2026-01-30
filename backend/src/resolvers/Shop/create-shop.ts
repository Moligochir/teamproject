import { Request, Response } from "express";
import { ShopModel } from "../../models/model-shop";

export const CreateShop = async (req: Request, res: Response) => {
  const { userId, title, image, price, phoneNumber } = req.body;

  try {
    if (!title || !image || !price || !phoneNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    const dbShop = await ShopModel.create({
      userId,
      title,
      image,
      price,
      phoneNumber,
    });

    res.status(201).json({ message: "success", data: dbShop });
  } catch (e: unknown) {
    console.log(e);
    res.status(500).json({ message: (e as Error).message });
  }
};
