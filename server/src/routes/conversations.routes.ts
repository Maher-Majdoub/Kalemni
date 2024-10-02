import express from "express";
import ConversationsController from "../controllers/conversations.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();
const conversationsCotroller = new ConversationsController();

router.get("/", authMiddleware, conversationsCotroller.getConversations);
router.post(
  "/:conversationId",
  authMiddleware,
  conversationsCotroller.sendMessage
);
router.get(
  "/:conversationId",
  authMiddleware,
  conversationsCotroller.getConversation
);

export default router;
