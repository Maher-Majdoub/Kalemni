import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import messageMiddleware from "../middlewares/message.milddleware";
import {
  getConversations,
  createConversationGroup,
  sendMessage,
  getConversation,
  getSharedMedia,
} from "../controllers/conversations.controller";

const router = express.Router();

router.get("/", authMiddleware, getConversations);
router.post("/create", authMiddleware, createConversationGroup);
router.get("/:conversationId", authMiddleware, getConversation);
router.get("/:conversationId/shared-media", authMiddleware, getSharedMedia);
router.post(
  "/:conversationId/messages/:messageType",
  authMiddleware,
  messageMiddleware,
  sendMessage
);

export default router;
