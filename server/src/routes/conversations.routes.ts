import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import messageMiddleware from "../middlewares/message.milddleware";
import {
  getConversations,
  createGroupConversation,
  sendMessage,
  getConversation,
  getSharedMedia,
  addUsersToGroupConversation,
  leaveConversation,
} from "../controllers/conversations.controller";

const router = express.Router();

router.get("/", authMiddleware, getConversations);
router.post("/create", authMiddleware, createGroupConversation);
router.get("/:conversationId", authMiddleware, getConversation);
router.delete("/:conversationId/leave", authMiddleware, leaveConversation);
router.get("/:conversationId/shared-media", authMiddleware, getSharedMedia);
router.post(
  "/:conversationId/messages/:messageType",
  authMiddleware,
  messageMiddleware,
  sendMessage
);
router.post(
  "/:conversationId/users/add",
  authMiddleware,
  addUsersToGroupConversation
);

export default router;
