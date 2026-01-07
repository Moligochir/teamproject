import { Request, Response } from "express";
import { AdoptSchemaModel } from "../../models/model-apopt";

type CreateAdopt = {
  name: string;
  age: number;
  gender: string;
  image: string;
  breed: string;
  description: string;
  adoptType: string;
};
export const CreateAdopt = async (
  req: Request<{}, {}, CreateAdopt>,
  res: Response
) => {
  const { name, age, gender, image, breed, description, adoptType } = req.body;
  const dbAdopt = await AdoptSchemaModel.create({
    name,
    age,
    gender,
    image,
    breed,
    description,
    adoptType,
  });

  res.status(200).json(dbAdopt);
};
