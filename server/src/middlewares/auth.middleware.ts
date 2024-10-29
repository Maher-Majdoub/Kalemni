import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../controllers/utils";
import User from "../models/user.model";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ message: "Unautorized" });

  const { isValid, data } = verifyToken(token);
  if (!isValid) return res.status(401).send({ message: "Invalid token" });

  const user = await User.findById(data._id).select("_id");

  if (!user) return res.status(401).send({ message: "Unauthorized" });

  req.body.user = data;
  next();
};

export default authMiddleware;
