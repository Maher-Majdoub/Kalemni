"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prepareStorage = (messageType) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const conversationId = req.params["conversationId"];
            const rootDir = path_1.default.resolve(__dirname, "..");
            const targetDir = `uploads/conversations/${conversationId}/${messageType}`;
            const uploadDir = path_1.default.join(rootDir, targetDir);
            if (!fs_1.default.existsSync(uploadDir))
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    });
    return (0, multer_1.default)({ storage, limits: { fileSize: 1 * 1024 * 1024 } });
};
const messageMiddleware = (req, res, next) => {
    const conversationId = req.params["conversationId"];
    const messageType = req.params["messageType"];
    const body = req.body;
    const parseRequestBody = (req) => {
        req.body = { ...req.body, message: JSON.parse(req.body.message), ...body };
    };
    if (messageType === "text") {
        (0, multer_1.default)().none()(req, res, () => {
            parseRequestBody(req);
            next();
        });
        return;
    }
    const upload = prepareStorage(messageType);
    upload.single(messageType)(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File is too large" });
        }
        parseRequestBody(req);
        req.body.message.content = `${req.protocol}://${req.get("host")}/uploads/conversations/${conversationId}/${messageType}/${req.file?.filename}`;
        next();
    });
};
exports.default = messageMiddleware;
