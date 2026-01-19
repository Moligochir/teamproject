import express from "express";
import { createLostFound } from "../resolvers/LostFound/create-LostFound";
import { getLostFound } from "../resolvers/LostFound/get-LostFound";
import { FindIdLostFound } from "../resolvers/LostFound/findid-lostFound";

export const LostFound = express.Router();
LostFound.get("/findid/:id", FindIdLostFound);
LostFound.post("/", createLostFound);
LostFound.get("/", getLostFound);
