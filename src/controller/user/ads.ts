import { Request, Response } from 'express';
import { Ads } from '../../database/model';

export const getAdsByPlacement = async (req: Request, res: Response) => {
    try {
        const { placement } = req.params;
        const { platform = 'both', category, device, country } = req.query;

        // Build query for active ads
        let query: any = {
            isActive: true,
            placement: placement,
            $or: [
                { platform: 'both' },
                { platform: platform }
            ]
        };

        // Add date range filter
        const now = new Date();
        query.startDate = { $lte: now };
        query.$or = [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
        ];

        // Add targeting filters
        if (category) {
            query.$or = [
                { targetCategories: { $exists: false } },
                { targetCategories: { $size: 0 } },
                { targetCategories: category }
            ];
        }

        if (device) {
            query.$or = [
                { targetDevices: { $exists: false } },
                { targetDevices: { $size: 0 } },
                { targetDevices: device }
            ];
        }

        if (country) {
            query.$or = [
                { targetCountries: { $exists: false } },
                { targetCountries: { $size: 0 } },
                { targetCountries: country }
            ];
        }

        // Get ads sorted by priority and random selection
        const ads = await Ads.aggregate([
            { $match: query },
            { $sort: { priority: -1, impressions: 1 } },
            { $limit: 5 } // Limit to prevent too many ads
        ]);

        res.status(200).json({
            status: 200,
            message: 'Ads retrieved successfully',
            data: {
                placement,
                platform,
                ads: ads.map(ad => ({
                    id: ad._id,
                    name: ad.name,
                    category: ad.category,
                    adCode: ad.adCode,
                    pixelId: ad.pixelId,
                    adUnitId: ad.adUnitId,
                    width: ad.width,
                    height: ad.height,
                    cssClass: ad.cssClass,
                    clickUrl: ad.clickUrl,
                    frequency: ad.frequency
                }))
            }
        });
    } catch (error) {
        console.error('Get ads by placement error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAdsByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const { platform = 'both', placement, device, country } = req.query;

        // Build query for active ads
        let query: any = {
            isActive: true,
            category: category,
            $or: [
                { platform: 'both' },
                { platform: platform }
            ]
        };

        // Add date range filter
        const now = new Date();
        query.startDate = { $lte: now };
        query.$or = [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
        ];

        // Add placement filter
        if (placement) {
            query.placement = placement;
        }

        // Add targeting filters
        if (device) {
            query.$or = [
                { targetDevices: { $exists: false } },
                { targetDevices: { $size: 0 } },
                { targetDevices: device }
            ];
        }

        if (country) {
            query.$or = [
                { targetCountries: { $exists: false } },
                { targetCountries: { $size: 0 } },
                { targetCountries: country }
            ];
        }

        // Get ads sorted by priority
        const ads = await Ads.find(query)
            .sort({ priority: -1, impressions: 1 })
            .limit(10);

        res.status(200).json({
            status: 200,
            message: 'Ads retrieved successfully',
            data: {
                category,
                platform,
                placement,
                ads: ads.map(ad => ({
                    id: ad._id,
                    name: ad.name,
                    category: ad.category,
                    placement: ad.placement,
                    adCode: ad.adCode,
                    pixelId: ad.pixelId,
                    adUnitId: ad.adUnitId,
                    width: ad.width,
                    height: ad.height,
                    cssClass: ad.cssClass,
                    clickUrl: ad.clickUrl,
                    frequency: ad.frequency
                }))
            }
        });
    } catch (error) {
        console.error('Get ads by category error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getRandomAd = async (req: Request, res: Response) => {
    try {
        const { platform = 'both', placement, category, device, country } = req.query;

        // Build query for active ads
        let query: any = {
            isActive: true,
            $or: [
                { platform: 'both' },
                { platform: platform }
            ]
        };

        // Add date range filter
        const now = new Date();
        query.startDate = { $lte: now };
        query.$or = [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
        ];

        // Add optional filters
        if (placement) {
            query.placement = placement;
        }

        if (category) {
            query.category = category;
        }

        // Add targeting filters
        if (device) {
            query.$or = [
                { targetDevices: { $exists: false } },
                { targetDevices: { $size: 0 } },
                { targetDevices: device }
            ];
        }

        if (country) {
            query.$or = [
                { targetCountries: { $exists: false } },
                { targetCountries: { $size: 0 } },
                { targetCountries: country }
            ];
        }

        // Get random ad
        const ad = await Ads.aggregate([
            { $match: query },
            { $sort: { priority: -1 } },
            { $sample: { size: 1 } }
        ]);

        if (ad.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No ads available for the specified criteria'
            });
        }

        const selectedAd = ad[0];

        res.status(200).json({
            status: 200,
            message: 'Ad retrieved successfully',
            data: {
                ad: {
                    id: selectedAd._id,
                    name: selectedAd.name,
                    category: selectedAd.category,
                    placement: selectedAd.placement,
                    adCode: selectedAd.adCode,
                    pixelId: selectedAd.pixelId,
                    adUnitId: selectedAd.adUnitId,
                    width: selectedAd.width,
                    height: selectedAd.height,
                    cssClass: selectedAd.cssClass,
                    clickUrl: selectedAd.clickUrl,
                    frequency: selectedAd.frequency
                }
            }
        });
    } catch (error) {
        console.error('Get random ad error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAdsInfo = async (req: Request, res: Response) => {
    try {
        // Get available placements, categories, and platforms
        const placements = await Ads.distinct('placement');
        const categories = await Ads.distinct('category');
        const platforms = await Ads.distinct('platform');

        // Get active ads count
        const activeAdsCount = await Ads.countDocuments({ isActive: true });

        res.status(200).json({
            status: 200,
            message: 'Ads information retrieved successfully',
            data: {
                availablePlacements: placements,
                availableCategories: categories,
                availablePlatforms: platforms,
                activeAdsCount,
                targetingOptions: {
                    devices: ['desktop', 'tablet', 'mobile'],
                    countries: ['US', 'CA', 'UK', 'AU', 'IN', 'DE', 'FR', 'JP', 'BR', 'MX']
                }
            }
        });
    } catch (error) {
        console.error('Get ads info error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 