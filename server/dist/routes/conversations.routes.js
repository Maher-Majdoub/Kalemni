"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const message_milddleware_1 = __importDefault(require("../middlewares/message.milddleware"));
const conversations_controller_1 = require("../controllers/conversations.controller");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default, conversations_controller_1.getConversations);
router.post("/create", auth_middleware_1.default, conversations_controller_1.createGroupConversation);
router.get("/:conversationId", auth_middleware_1.default, conversations_controller_1.getConversation);
router.delete("/:conversationId/leave", auth_middleware_1.default, conversations_controller_1.leaveConversation);
router.get("/:conversationId/shared-media", auth_middleware_1.default, conversations_controller_1.getSharedMedia);
router.post("/:conversationId/messages/:messageType", auth_middleware_1.default, message_milddleware_1.default, conversations_controller_1.sendMessage);
router.post("/:conversationId/users/add", auth_middleware_1.default, conversations_controller_1.addUsersToGroupConversation);
exports.default = router;
