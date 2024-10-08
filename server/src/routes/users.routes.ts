import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getProfile,
  getFriends,
  getOnlineFriends,
  getNewFriends,
  getFriendRequests,
  acceptFriendRequest,
  refuseFriendRequest,
  sendFriendRequest,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.get("/me/friends", authMiddleware, getFriends);
router.get("/me/friends/online", authMiddleware, getOnlineFriends);
router.get("/find", authMiddleware, getNewFriends);
router.get("/me/friends/requests", authMiddleware, getFriendRequests);

router.post(
  "/me/friends/requests/:requestId/accept",
  authMiddleware,
  acceptFriendRequest
);

router.post(
  "/me/friends/requests/:requestId/refuse",
  authMiddleware,
  refuseFriendRequest
);

router.post("/:userId/friend-requests", authMiddleware, sendFriendRequest);

export default router;
