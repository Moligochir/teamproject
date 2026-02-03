"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageEmbedding = getImageEmbedding;
const axios_1 = __importDefault(require("axios"));
const FEATURE_LABELS = [
    "Dog",
    "Cat",
    "Mammal",
    "Pet",
    "Animal",
    "Canidae",
    "Feline",
    "Puppy",
    "Kitten",
    "Street",
    "Collar",
    "Leash",
    "Brown",
    "Black",
    "White",
    "Gray",
];
function buildVector(scores) {
    return FEATURE_LABELS.map((l) => { var _a; return (_a = scores[l]) !== null && _a !== void 0 ? _a : 0; });
}
async function getImageEmbedding(imageUrl) {
    var _a, _b, _c, _d;
    const apiKey = process.env.GOOGLE_API_KEY;
    const res = await axios_1.default.post(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        requests: [
            {
                image: {
                    source: { imageUri: imageUrl },
                },
                features: [
                    { type: "LABEL_DETECTION", maxResults: 20 },
                    { type: "OBJECT_LOCALIZATION", maxResults: 20 },
                ],
            },
        ],
    });
    const result = res.data.responses[0];
    const scores = {};
    for (const l of result.labelAnnotations || []) {
        scores[l.description] = Math.max((_a = scores[l.description]) !== null && _a !== void 0 ? _a : 0, (_b = l.score) !== null && _b !== void 0 ? _b : 0);
    }
    for (const o of result.localizedObjectAnnotations || []) {
        scores[o.name] = Math.max((_c = scores[o.name]) !== null && _c !== void 0 ? _c : 0, ((_d = o.score) !== null && _d !== void 0 ? _d : 0) * 1.1);
    }
    return buildVector(scores);
}
