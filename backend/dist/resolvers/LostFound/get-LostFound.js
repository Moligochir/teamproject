"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLostFound = void 0;
const LostFoundModel_1 = require("../../models/LostFoundModel");
const getLostFound = async (req, res) => {
    const dbLostFound = await LostFoundModel_1.LostFoundModel.find();
    res.status(200).json(dbLostFound);
};
exports.getLostFound = getLostFound;
