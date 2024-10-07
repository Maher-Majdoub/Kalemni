import express from "express";
import ConversationsController from "../controllers/conversations.controller";
import authMiddleware from "../middlewares/auth.middleware";
import fileUploaderMiddleware from "../middlewares/fileUploader.milddleware";

const router = express.Router();
const conversationsCotroller = new ConversationsController();

router.get("/", authMiddleware, conversationsCotroller.getConversations);

router.post(
  "/create",
  authMiddleware,
  conversationsCotroller.createConversationGroup
);

router.post(
  "/:conversationId",
  authMiddleware,
  conversationsCotroller.sendMessage
);

router.post(
  "/:conversationId/audio",
  authMiddleware,
  fileUploaderMiddleware,
  conversationsCotroller.sendAudioRecord
);

router.get(
  "/:conversationId",
  authMiddleware,
  conversationsCotroller.getConversation
);

export default router;
