import mongoose, { Schema, Document } from 'mongoose';
import Admin from './admin';

const gameSchema = new mongoose.Schema({
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

const Game = mongoose.model('Game', gameSchema);

export { Game, Admin };

