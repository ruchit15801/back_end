import mongoose, { Schema, Document } from 'mongoose';

export interface IAds extends Document {
    name: string;
    category: 'banner' | 'popup' | 'interstitial' | 'rewarded' | 'native' | 'video';
    placement: 'header' | 'footer' | 'sidebar' | 'content' | 'fullscreen' | 'game-over' | 'pause';
    platform: 'web' | 'mobile' | 'both';
    adType: 'google-adsense' | 'facebook-ads' | 'admob' | 'custom' | 'other';

    // Ad configuration
    pixelId?: string;
    adCode: string;
    adUnitId?: string;

    // Display settings
    isActive: boolean;
    startDate: Date;
    endDate?: Date;
    priority: number;

    // Targeting
    targetDevices?: string[];
    targetCategories?: string[];
    targetCountries?: string[];

    // Performance tracking
    impressions: number;
    clicks: number;
    ctr: number; // Click-through rate

    // Dimensions and styling
    width?: number;
    height?: number;
    cssClass?: string;

    // Advanced settings
    frequency: number; // How often to show (1 = every time, 2 = every 2nd time, etc.)
    maxImpressions?: number; // Daily limit
    clickUrl?: string;

    // Analytics
    lastShown?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const adsSchema = new Schema<IAds>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['banner', 'popup', 'interstitial', 'rewarded', 'native', 'video'],
        default: 'banner'
    },
    placement: {
        type: String,
        required: true,
        enum: ['header', 'footer', 'sidebar', 'content', 'fullscreen', 'game-over', 'pause'],
        default: 'header'
    },
    platform: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'both'],
        default: 'both'
    },
    adType: {
        type: String,
        required: true,
        enum: ['google-adsense', 'facebook-ads', 'admob', 'custom', 'other'],
        default: 'custom'
    },

    // Ad configuration
    pixelId: {
        type: String,
        trim: true
    },
    adCode: {
        type: String,
        required: true
    },
    adUnitId: {
        type: String,
        trim: true
    },

    // Display settings
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },

    // Targeting
    targetDevices: [{
        type: String,
        enum: ['desktop', 'tablet', 'mobile']
    }],
    targetCategories: [String],
    targetCountries: [String],

    // Performance tracking
    impressions: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    ctr: {
        type: Number,
        default: 0
    },

    // Dimensions and styling
    width: Number,
    height: Number,
    cssClass: String,

    // Advanced settings
    frequency: {
        type: Number,
        default: 1,
        min: 1
    },
    maxImpressions: Number,
    clickUrl: String,

    // Analytics
    lastShown: Date
}, {
    timestamps: true
});

// Calculate CTR before saving
adsSchema.pre('save', function (next) {
    if (this.impressions > 0) {
        this.ctr = (this.clicks / this.impressions) * 100;
    }
    next();
});

// Index for efficient queries
adsSchema.index({ isActive: 1, category: 1, placement: 1, platform: 1 });
adsSchema.index({ startDate: 1, endDate: 1 });
adsSchema.index({ priority: -1 });

const Ads = mongoose.model<IAds>('Ads', adsSchema);

export default Ads; 