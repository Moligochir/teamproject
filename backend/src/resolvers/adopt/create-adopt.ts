import { Request, Response } from "express";
import { AdoptSchemaModel } from "../../models/model-apopt";

export const CreateAdopt = async (req: Request, res: Response) => {
  const newAdopt = req.body;
  try {
    const dbAdopt = await AdoptSchemaModel.create({
      petType: newAdopt.petType,
      userId: newAdopt.userId,
      name: newAdopt.name,
      age: newAdopt.age,
      image: newAdopt.image,
      breed: newAdopt.breed,
      description: newAdopt.description,
    });
    res.status(200).json("success");
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
