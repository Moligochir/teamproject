"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./routes/users");
const adopt_1 = require("./routes/adopt");
const lostFound_1 = require("./routes/lostFound");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const shop_1 = require("./routes/shop");
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/adopt", adopt_1.Adopt);
app.use("/users", users_1.User);
app.use("/lostFound", lostFound_1.LostFound);
app.use("/shop", shop_1.Shop);
mongoose_1.default
    .connect("mongodb+srv://welovepetspawpew_db_user:Pawpew1234@cluster0.gdp0zjv.mongodb.net/")
    .then(() => console.log("connected"));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/users`);
});
