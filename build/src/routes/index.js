"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const common_1 = require("../common");
const games_1 = __importDefault(require("./user/games"));
const contact_1 = __importDefault(require("./user/contact"));
const ads_1 = __importDefault(require("./user/ads"));
const admin_1 = __importDefault(require("./admin"));
// import { userRoutes } from './user'
const router = (0, express_1.Router)();
exports.router = router;
const accessControl = (req, res, next) => {
    req.headers.userType = common_1.userStatus[req.originalUrl.split('/')[1]];
    next();
};
router.use('/admin', admin_1.default);
router.use('/games', games_1.default);
router.use('/contact', contact_1.default);
router.use('/ads', ads_1.default);
//# sourceMappingURL=index.js.map