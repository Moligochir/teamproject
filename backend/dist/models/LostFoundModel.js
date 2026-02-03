"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostFoundModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LostFoundSchema = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    userId: {
        type: mongoose_1.default.Schema.Types.String,
        require: true,
        ref: "User",
    },
    role: { type: String, enum: ["Lost", "Found", "Adopt"] },
    petType: { type: String, enum: ["Dog", "Cat"] },
    name: String,
    gender: { type: String, enum: ["Male", "Female", "Unknown"] },
    image: String,
    lat: Number,
    lng: Number,
    location: String,
    description: String,
    Date: Date,
    breed: { type: String },
    phonenumber: Number,
    imageEmbedding: {
        type: [Number],
        default: [],
    },
    matchScore: Number,
    matchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "LostFound",
        default: null,
    },
    matches: {
        type: [
            {
                postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "LostFound" },
                score: Number,
            },
        ],
        default: [],
    },
}, { timestamps: true });
exports.LostFoundModel = mongoose_1.default.model("LostFound", LostFoundSchema);
