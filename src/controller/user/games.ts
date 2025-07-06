import { Request, Response } from 'express';
import { Game } from '../../database/model';

export const getGames = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const category = req.query.category as string;

        const skip = (page - 1) * limit;

        let query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const total = await Game.countDocuments(query);

        const games = await Game.aggregate([
            { $match: query },
            { $sample: { size: limit + skip } },
            { $skip: skip },
            { $limit: limit }
        ]);

        res.status(200).json({
            status: 200,
            message: 'Games retrieved successfully',
            data: {
                games,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get games error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getGameById = async (req: Request, res: Response) => {
    try {
        const gameId = parseInt(req.params.id);

        const game = await Game.findOne({ gameId });

        if (!game) {
            return res.status(404).json({
                status: 404,
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Game retrieved successfully',
            data: { game }
        });
    } catch (error) {
        console.error('Get game by ID error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};