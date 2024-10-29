"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePictureMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prepareStorage = (userId) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const rootDir = path_1.default.resolve(__dirname, "..");
            const targetDir = `uploads/profilePictures/`;
            const uploadDir = path_1.default.join(rootDir, targetDir);
            if (!fs_1.default.existsSync(uploadDir))
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${userId}_${Date.now()}_${file.originalname.replaceAll(" ", "_")}`);
        },
    });
    return (0, multer_1.default)({ storage, limits: { fileSize: 1 * 1024 * 1024 } });
};
const uploadProfilePictureMiddleware = (req, res, next) => {
    const body = req.body;
    const upload = prepareStorage(body.user._id);
    upload.single("picture")(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File is too large" });
        }
        req.body = { ...req.body, ...body };
        next();
    });
};
exports.uploadProfilePictureMiddleware = uploadProfilePictureMiddleware;
