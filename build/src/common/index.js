"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification_template = exports.userStatus = exports.apiResponse = void 0;
const apiResponse = (status, message, data, error) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return {
        status,
        message,
        data: yield (data),
        error: ((_a = Object.keys(error)) === null || _a === void 0 ? void 0 : _a.length) == 0 ? {} : yield (error)
    };
});
exports.apiResponse = apiResponse;
exports.userStatus = {
    user: 1,
    admin: 2
};
exports.notification_template = {
    message: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            template: {
                title: `Message Received`, body: `${data.firstName} ${data.lastName}: ${data.message}`
            },
            data: {
                type: 1, senderId: data === null || data === void 0 ? void 0 : data._id, roomId: data === null || data === void 0 ? void 0 : data.roomId, senderName: data === null || data === void 0 ? void 0 : data.firstName, senderImage: data === null || data === void 0 ? void 0 : data.image, click_action: "chat listing",
            }
        };
    })
};
//# sourceMappingURL=index.js.map