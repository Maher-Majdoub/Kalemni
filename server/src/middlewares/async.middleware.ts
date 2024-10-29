import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";

const asyncMiddleware = (handler: (req: Request, res: Response) => any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex); // this calls error middleware
    }
  };
};

export default asyncMiddleware;
