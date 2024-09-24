import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";

const router = express.Router();
const userController = new UserController();

router.get("/me", authMiddleware, userController.getProfile);

router.get("/me/friends", authMiddleware, userController.getFriends);

router.get(
  "/me/friends/requests",
  authMiddleware,
  userController.getFriendRequests
);

router.post(
  "/me/friends/requests/:requestId/accept",
  authMiddleware,
  userController.acceptFriendRequest
);

router.post(
  "/me/friends/requests/:requestId/refuse",
  authMiddleware,
  userController.refuseFriendRequest
);

router.post(
  "/:userId/friend-requests",
  authMiddleware,
  userController.sendFriendRequest
);

export default router;
