import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfileInfos,
  updateProfilePicture,
  updateLoginInfos,
  getFriends,
  getOnlineFriends,
  getNewFriends,
  getFriendRequests,
  acceptFriendRequest,
  refuseFriendRequest,
  sendFriendRequest,
  deleteProfilePicture,
} from "../controllers/user.controller";
import { uploadProfilePictureMiddleware } from "../middlewares/upload_profile_picture.middleware";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.patch("/me/profile/infos", authMiddleware, updateProfileInfos);
router.patch(
  "/me/profile/picture",
  authMiddleware,
  uploadProfilePictureMiddleware,
  updateProfilePicture
);
router.delete("/me/profile/picture", authMiddleware, deleteProfilePicture);
router.patch("/me/auth", authMiddleware, updateLoginInfos);
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
