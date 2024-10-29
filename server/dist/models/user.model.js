"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateLoginInfosData = exports.validateUpdateProfileInfosData = exports.validateCreateUser = exports.validateAuthUser = exports.userSnapshotSchema = exports.userSnapshotFields = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../controllers/utils");
exports.userSnapshotFields = [
    "_id",
    "firstName",
    "lastName",
    "bio",
    "profilePicture",
];
exports.userSnapshotSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String },
});
const userSchema = new mongoose_1.Schema({
    authType: {
        type: String,
        enum: ["normal", "google"],
        default: "normal",
    },
    username: { type: String },
    password: { type: String },
    sub: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ["m", "f"] },
    friends: [{ type: mongoose_1.Types.ObjectId, ref: "User" }],
    friendRequests: [
        {
            _id: { type: mongoose_1.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
            user: { type: mongoose_1.Types.ObjectId, ref: "User" },
        },
    ],
}, {
    timestamps: true,
});
userSchema.method("getSnapshot", function getSnapshot() {
    return {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        bio: this.bio,
        profilePicture: this.profilePicture,
    };
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
const userAuthJoiObject = {
    username: joi_1.default.string().min(5).max(30).required(),
    password: joi_1.default.string().min(5).max(30).required(),
};
const validateAuthUser = (data) => {
    const schema = joi_1.default.object(userAuthJoiObject);
    return (0, utils_1.extractJoiErrors)(schema.validate(data).error);
};
exports.validateAuthUser = validateAuthUser;
const validateCreateUser = (data) => {
    const schema = joi_1.default.object({
        ...userAuthJoiObject,
        firstName: joi_1.default.string().min(3).max(20).required(),
        lastName: joi_1.default.string().min(3).max(20).required(),
    });
    return (0, utils_1.extractJoiErrors)(schema.validate(data, { abortEarly: false }).error);
};
exports.validateCreateUser = validateCreateUser;
const validateUpdateProfileInfosData = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        bio: joi_1.default.string().allow(null, "").optional(),
        birthDate: joi_1.default.date().allow(null).optional(),
        gender: joi_1.default.string().allow(null).optional(),
    });
    return (0, utils_1.extractJoiErrors)(schema.validate(data, { abortEarly: false }).error);
};
exports.validateUpdateProfileInfosData = validateUpdateProfileInfosData;
const validateUpdateLoginInfosData = (data) => {
    const schema = joi_1.default.object({
        newUsername: joi_1.default.string().allow("", null).optional(),
        newPassword: joi_1.default.string().allow("", null).optional(),
        oldPassword: joi_1.default.string().required(),
    });
    return (0, utils_1.extractJoiErrors)(schema.validate(data, { abortEarly: false }).error);
};
exports.validateUpdateLoginInfosData = validateUpdateLoginInfosData;
