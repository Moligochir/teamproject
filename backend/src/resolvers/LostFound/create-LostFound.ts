import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";

export const createLostFound = async (req: Request, res: Response) => {
  const newLostFound = req.body;
  try {
    await LostFoundModel.create({
      role: newLostFound.role,
      petType: newLostFound.petType,
      name: newLostFound.name,
      breed: newLostFound.breed,
      location: newLostFound.location,
      lat: newLostFound.lat,
      lng: newLostFound.lng,
      description: newLostFound.description,
      image: newLostFound.image,
      userId: newLostFound.userId,
      gender: newLostFound.gender,
      Date: newLostFound.Date,
      phonenumber: newLostFound.phonenumber,
    });

    res.status(200).json("success");
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
