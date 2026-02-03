"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindIdLostFound = void 0;
const LostFoundModel_1 = require("../../models/LostFoundModel");
const FindIdLostFound = async (req, res) => {
    try {
        const LostFound = await LostFoundModel_1.LostFoundModel.find({
            _id: req.params.id,
        }).populate("userId");
        res.status(200).json(LostFound);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
exports.FindIdLostFound = FindIdLostFound;
