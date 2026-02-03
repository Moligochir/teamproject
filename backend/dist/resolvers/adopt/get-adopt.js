"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdopt = void 0;
const model_apopt_1 = require("../../models/model-apopt");
const getAdopt = async (req, res) => {
    const dbAdopt = await model_apopt_1.AdoptSchemaModel.find();
    res.status(200).json(dbAdopt);
};
exports.getAdopt = getAdopt;
