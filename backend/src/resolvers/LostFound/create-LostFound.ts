import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";
import { sendPostNotification } from "../../server";
import { getImageHash, hamming } from "../LostFound/dhash";

export const createLostFound = async (req: Request, res: Response) => {
  const newLostFound = req.body;

  try {
    const send = await sendPostNotification(
      newLostFound.name,
      newLostFound.description,
    );
    if (send) {
      console.log("Admin notified!");
    } else {
      console.log("Failed to send email");
    }
    const hash = await getImageHash(newLostFound.image);

    const posts = await LostFoundModel.find(
      { imageHash: { $exists: true, $ne: null } },
      { image: 1, imageHash: 1 },
    ).lean();

    const matches = posts
      .map((p: any) => ({
        postId: p._id,
        image: p.image,
        dist: hamming(hash, p.imageHash),
      }))
      .filter((m) => m.dist < 250)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 10);

    const created = await LostFoundModel.create({
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
      imageHash: hash,
    });

    res.status(200).json({
      success: true,
      createdId: created._id,
      matches,
    });
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
