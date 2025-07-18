import { Request, Response } from 'express';
import { Contact, Game } from '../../database/model';

const generate6DigitGameId = async (): Promise<number> => {
    let gameId: number;
    let exists = true;

    while (exists) {
        gameId = Math.floor(100000 + Math.random() * 900000);
        const existing = await Game.findOne({ gameId });
        exists = !!existing;
    }

    return gameId;
};

export const addGame = async (req: Request, res: Response) => {
    try {
        const gameData = req.body;

        if (!gameData.title || !gameData.url) {
            return res.status(400).json({
                status: 400,
                message: 'Title and URL are required',
            });
        }

        if (!gameData.gameId) {
            gameData.gameId = await generate6DigitGameId();
        } else {
            const parsedId = parseInt(gameData.gameId);
            if (isNaN(parsedId) || parsedId < 100000 || parsedId > 999999) {
                return res.status(400).json({
                    status: 400,
                    message: 'Provided gameId must be a 6-digit number',
                });
            }

            const existingGame = await Game.findOne({ gameId: parsedId });
            if (existingGame) {
                return res.status(409).json({
                    status: 409,
                    message: 'Game with this gameId already exists',
                });
            }

            gameData.gameId = parsedId;
        }

        if (typeof gameData.tags === 'string') {
            gameData.tags = gameData.tags.split(',').map(tag => tag.trim());
        }

        const newGame = new Game(gameData);
        await newGame.save();

        res.status(201).json({
            status: 201,
            message: 'Game added successfully',
            data: { game: newGame },
        });

    } catch (error) {
        console.error('Add game error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const updateGame = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const updateData = req.body;

        // Find game by gameId
        const game = await Game.findOne({ gameId: parseInt(gameId) });
        if (!game) {
            return res.status(404).json({
                status: 404,
                message: 'Game not found'
            });
        }

        // Process tags if provided as string
        if (typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
        }

        // Update the game
        const updatedGame = await Game.findOneAndUpdate(
            { gameId: parseInt(gameId) },
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 200,
            message: 'Game updated successfully',
            data: { game: updatedGame }
        });
    } catch (error) {
        console.error('Update game error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;

        const game = await Game.findOneAndDelete({ gameId: parseInt(gameId) });
        if (!game) {
            return res.status(404).json({
                status: 404,
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Game deleted successfully'
        });
    } catch (error) {
        console.error('Delete game error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 10;
        const search = req.body.search as string;
        const category = req.body.category as string;
        const sortBy = req.body.sortBy as string || 'createdAt';
        const sortOrder = req.body.sortOrder as string === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        // Build query
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

        // Get total count
        const total = await Game.countDocuments(query);

        // Get games with pagination and sorting
        const games = await Game.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        // Get unique categories for filter
        const categories = await Game.distinct('category');

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
                },
                filters: {
                    categories,
                    search,
                    category
                }
            }
        });
    } catch (error) {
        console.error('Get all games error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getGameById = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;

        const game = await Game.findOne({ gameId: parseInt(gameId) });
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

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [gameCount, contactCount] = await Promise.all([
            Game.countDocuments(),
            Contact.countDocuments(),
        ]);

        return res.status(200).json({
            status: 200,
            message: 'Dashboard statistics fetched successfully',
            data: {
                total_games: gameCount,
                total_contact_messages: contactCount,
            },
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};