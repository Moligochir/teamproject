import express from "express";
import { getAdopt } from "../resolvers/adopt/get-adopt";
import { CreateAdopt } from "../resolvers/adopt/create-adopt";

export const Adopt = express.Router();

Adopt.post("/", CreateAdopt);
Adopt.get("/", getAdopt);
