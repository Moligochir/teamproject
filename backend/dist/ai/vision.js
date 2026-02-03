"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = analyzeImage;
const vision_1 = __importDefault(require("@google-cloud/vision"));
console.log("Using key:", (_a = process.env.GOOGLE_API_KEY) === null || _a === void 0 ? void 0 : _a.slice(0, 6));
const client = new vision_1.default.ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_API_KEY,
});
async function analyzeImage(imageUrl) {
    const [result] = await client.annotateImage({
        image: { source: { imageUri: imageUrl } },
        features: [
            { type: "LABEL_DETECTION", maxResults: 10 },
            { type: "OBJECT_LOCALIZATION", maxResults: 10 },
        ],
    });
    return {
        labels: result.labelAnnotations,
        objects: result.localizedObjectAnnotations,
    };
}
