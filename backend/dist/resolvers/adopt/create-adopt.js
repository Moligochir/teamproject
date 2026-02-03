"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdopt = void 0;
const model_apopt_1 = require("../../models/model-apopt");
const CreateAdopt = async (req, res) => {
    const newAdopt = req.body;
    try {
        const dbAdopt = await model_apopt_1.AdoptSchemaModel.create({
            petType: newAdopt.petType,
            userId: newAdopt.userId,
            name: newAdopt.name,
            age: newAdopt.age,
            image: newAdopt.image,
            breed: newAdopt.breed,
            description: newAdopt.description,
            phonenumber: newAdopt.phonenumber,
        });
        res.status(200).json({ message: "success", data: dbAdopt });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
        console.log(e);
    }
};
exports.CreateAdopt = CreateAdopt;
