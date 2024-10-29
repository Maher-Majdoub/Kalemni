import { NextFunction, Request, Response } from "express";
import multer from "multer";
import winston from "winston";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  winston.error(err.message, err);
  res.status(500).send("Something went wrong");
};
