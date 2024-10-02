import express from "express";
import auth from "./auth.routes";
import users from "./users.routes";
import conversations from "./conversations.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/users/me/conversations", conversations);

export default router;
