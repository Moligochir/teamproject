import express from "express";
import { createLostFound } from "../resolvers/LostFound/create-LostFound";
import { getLostFound } from "../resolvers/LostFound/get-LostFound";
import { FindIdLostFound } from "../resolvers/LostFound/findid-lostFound";
import { deleteLostFound } from "../resolvers/LostFound/delete-LostFound";
import { putLostFound } from "../resolvers/LostFound/put-LostFound";

export const LostFound = express.Router();
LostFound.get("/findid/:id", FindIdLostFound);
LostFound.post("/", createLostFound);
LostFound.get("/", getLostFound);
LostFound.delete("/:id", deleteLostFound);
LostFound.put("/:id", putLostFound);
