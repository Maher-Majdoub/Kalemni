import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfileInfos,
  updateProfilePicture,
  deleteProfilePicture,
} from "../controllers/user.controller";
import {
  acceptFriendRequest,
  deleteFriend,
  getFriendRequests,
  getFriends,
  getNewFriends,
  getOnlineFriends,
  refuseFriendRequest,
  sendFriendRequest,
} from "../controllers/friends.controller";
import { uploadProfilePictureMiddleware } from "../middlewares/upload_profile_picture.middleware";
import { updateLoginInfos } from "../controllers/auth.controller";

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
router.delete("/me/friends/:userId", authMiddleware, deleteFriend);

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
