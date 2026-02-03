"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdoptSchemaModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const AdoptSchema = new Schema({
    id: ObjectId,
    userId: {
        type: mongoose_1.default.Schema.Types.String,
        require: true,
        ref: "User",
    },
    petType: { type: String, enum: ["Dog", "Cat"] },
    name: { type: String, require: true },
    age: { type: Number },
    gender: { type: String, require: true },
    image: { type: String, require: true },
    breed: String,
    description: { type: String, require: true },
    createAt: { type: Date, default: Date.now },
    adoptType: { type: String, enum: ["YES", "NO"], default: "NO" },
    updateAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.AdoptSchemaModel = mongoose_1.default.model("Adopt", AdoptSchema);
