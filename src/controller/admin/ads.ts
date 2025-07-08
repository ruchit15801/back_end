import { Request, Response } from 'express';
import { Ads } from '../../database/model';

export const addAd = async (req: Request, res: Response) => {
    try {
        const adData = req.body;

        // Validation
        if (!adData.name || !adData.adCode) {
            return res.status(400).json({
                status: 400,
                message: 'Name and ad code are required'
            });
        }

        // Validate dates
        if (adData.endDate && new Date(adData.endDate) <= new Date(adData.startDate)) {
            return res.status(400).json({
                status: 400,
                message: 'End date must be after start date'
            });
        }

        // Create new ad
        const ad = new Ads(adData);
        await ad.save();

        res.status(201).json({
            status: 201,
            message: 'Ad created successfully',
            data: { ad }
        });
    } catch (error) {
        console.error('Add ad error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const updateAd = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;
        const updateData = req.body;

        // Validate dates if provided
        if (updateData.endDate && updateData.startDate) {
            if (new Date(updateData.endDate) <= new Date(updateData.startDate)) {
                return res.status(400).json({
                    status: 400,
                    message: 'End date must be after start date'
                });
            }
        }

        const ad = await Ads.findByIdAndUpdate(
            adId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!ad) {
            return res.status(404).json({
                status: 404,
                message: 'Ad not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Ad updated successfully',
            data: { ad }
        });
    } catch (error) {
        console.error('Update ad error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const deleteAd = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;

        const ad = await Ads.findByIdAndDelete(adId);
        if (!ad) {
            return res.status(404).json({
                status: 404,
                message: 'Ad not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Ad deleted successfully'
        });
    } catch (error) {
        console.error('Delete ad error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAllAds = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const category = req.query.category as string;
        const placement = req.query.placement as string;
        const platform = req.query.platform as string;
        const isActive = req.query.isActive as string;
        const search = req.query.search as string;
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        // Build query
        let query: any = {};

        if (category) {
            query.category = category;
        }

        if (placement) {
            query.placement = placement;
        }

        if (platform) {
            query.platform = platform;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { adCode: { $regex: search, $options: 'i' } },
                { pixelId: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count
        const total = await Ads.countDocuments(query);

        // Get ads with pagination and sorting
        const ads = await Ads.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        // Get unique categories, placements, and platforms for filters
        const categories = await Ads.distinct('category');
        const placements = await Ads.distinct('placement');
        const platforms = await Ads.distinct('platform');

        res.status(200).json({
            status: 200,
            message: 'Ads retrieved successfully',
            data: {
                ads,
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
                    placements,
                    platforms,
                    search,
                    category,
                    placement,
                    platform,
                    isActive
                }
            }
        });
    } catch (error) {
        console.error('Get all ads error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAdById = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;

        const ad = await Ads.findById(adId);
        if (!ad) {
            return res.status(404).json({
                status: 404,
                message: 'Ad not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Ad retrieved successfully',
            data: { ad }
        });
    } catch (error) {
        console.error('Get ad by ID error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const toggleAdStatus = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;

        const ad = await Ads.findById(adId);
        if (!ad) {
            return res.status(404).json({
                status: 404,
                message: 'Ad not found'
            });
        }

        ad.isActive = !ad.isActive;
        await ad.save();

        res.status(200).json({
            status: 200,
            message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { ad }
        });
    } catch (error) {
        console.error('Toggle ad status error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAdsAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30' } = req.query; // days
        const days = parseInt(period as string);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get total stats
        const totalAds = await Ads.countDocuments();
        const activeAds = await Ads.countDocuments({ isActive: true });
        const inactiveAds = totalAds - activeAds;

        // Get performance stats
        const performanceStats = await Ads.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalImpressions: { $sum: '$impressions' },
                    totalClicks: { $sum: '$clicks' },
                    avgCTR: { $avg: '$ctr' }
                }
            }
        ]);

        // Get top performing ads
        const topAds = await Ads.find()
            .sort({ impressions: -1 })
            .limit(5)
            .select('name category impressions clicks ctr');

        // Get ads by category
        const adsByCategory = await Ads.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalImpressions: { $sum: '$impressions' },
                    totalClicks: { $sum: '$clicks' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const stats = performanceStats[0] || {
            totalImpressions: 0,
            totalClicks: 0,
            avgCTR: 0
        };

        res.status(200).json({
            status: 200,
            message: 'Ads analytics retrieved successfully',
            data: {
                overview: {
                    totalAds,
                    activeAds,
                    inactiveAds,
                    activePercentage: totalAds > 0 ? Math.round((activeAds / totalAds) * 100) : 0
                },
                performance: {
                    totalImpressions: stats.totalImpressions,
                    totalClicks: stats.totalClicks,
                    avgCTR: Math.round(stats.avgCTR * 100) / 100,
                    period: `${days} days`
                },
                topAds,
                adsByCategory
            }
        });
    } catch (error) {
        console.error('Get ads analytics error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const recordImpression = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;

        const ad = await Ads.findById(adId);
        if (!ad) {
            return res.status(404).json({
                status: 404,
                message: 'Ad not found'
            });
        }

        // Check if ad is active and within date range
        if (!ad.isActive) {
            return res.status(400).json({
                status: 400,
                message: 'Ad is not active'
            });
        }

        const now = new Date();
        if (ad.startDate > now || (ad.endDate && ad.endDate < now)) {
            return res.status(400).json({
                status: 400,
                message: 'Ad is not within active date range'
            });
        }

        // Update impressions and last shown
        ad.impressions += 1;
        ad.lastShown = now;
        await ad.save();

        res.status(200).json({
            status: 200,
            message: 'Impression recorded successfully'
        });
    } catch (error) {
        console.error('Record impression error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const recordClick = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;

        const ad = await Ads.findById(adId);
        if (!ad) {
            return res.status(404).json({
                status: 404,
                message: 'Ad not found'
            });
        }

        // Update clicks
        ad.clicks += 1;
        await ad.save();

        res.status(200).json({
            status: 200,
            message: 'Click recorded successfully'
        });
    } catch (error) {
        console.error('Record click error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 