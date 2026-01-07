import express from "express";
import { createLostFound } from "../resolvers/LostFound/create-LostFound";
import { getLostFound } from "../resolvers/LostFound/get-LostFound";

export const LostFound = express.Router();

LostFound.post("/", createLostFound);
LostFound.get("/", getLostFound);
