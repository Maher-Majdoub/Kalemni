import multer from "multer";
import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const conversationId = req.params["conversationId"];

    const uploadsDir = path.join(
      path.resolve(__dirname, ".."),
      `uploads/conversations/${conversationId}/`
    );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const fileUploaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  upload.single("audio")(req, res, () => {
    req.body = { ...req.body, ...body };
    next();
  });
};

export default fileUploaderMiddleware;
