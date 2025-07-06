import { Request, Response } from 'express';
import Game from '../../database/model';

export const addGame = async (req, res) => {
    try {
        const gameData = req.body;

        if (typeof gameData.tags === 'string') {
            gameData.tags = gameData.tags.split(',').map(tag => tag.trim());
        }

        const newGame = new Game(gameData);
        await newGame.save();

        res.status(201).json({ message: 'Game added successfully', game: newGame });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGames = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const total = await Game.countDocuments();

        const games = await Game.aggregate([
            { $sample: { size: limit + skip } },
            { $skip: skip },
            { $limit: limit }
        ]);

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalGames: total,
            games
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};