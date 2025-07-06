"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.Game = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admin_1 = __importDefault(require("./admin"));
exports.Admin = admin_1.default;
const gameSchema = new mongoose_1.default.Schema({
    gameId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    instructions: String,
    url: { type: String, required: true },
    category: String,
    tags: [String],
    thumb: String,
    width: Number,
    height: Number
}, { timestamps: true });
const Game = mongoose_1.default.model('Game', gameSchema);
exports.Game = Game;
//# sourceMappingURL=index.js.map