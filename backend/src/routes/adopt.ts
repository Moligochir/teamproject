import express from "express";
import { getAdopt } from "../resolvers/adopt/get-adopt";
import { CreateAdopt } from "../resolvers/adopt/create-adopt";
import { FindIdAdopt } from "../resolvers/adopt/FindIdAdopt";

export const Adopt = express.Router();
Adopt.post("/", CreateAdopt);
Adopt.get("/", getAdopt);
Adopt.get("/findid/:id", FindIdAdopt);
