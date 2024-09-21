import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ message: "Unautorized" });

  const { isValid, data } = verifyToken(token);
  if (!isValid) return res.status(401).send({ message: "Invalid token" });

  req.body.user = data;
  next();
};

export default authMiddleware;
