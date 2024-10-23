import multer from "multer";
import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

const prepareStorage = (messageType: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const conversationId = req.params["conversationId"];
      const rootDir = path.resolve(__dirname, "..");
      const targetDir = `uploads/conversations/${conversationId}/${messageType}`;
      const uploadDir = path.join(rootDir, targetDir);

      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  return multer({ storage });
};

const messageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const conversationId = req.params["conversationId"];
  const messageType = req.params["messageType"];
  const body = req.body;

  const parseRequestBody = (req: Request) => {
    req.body = { ...req.body, message: JSON.parse(req.body.message), ...body };
  };

  if (messageType === "text") {
    multer().none()(req, res, () => {
      parseRequestBody(req);
      next();
    });
    return;
  }

  const upload = prepareStorage(messageType);

  upload.single(messageType)(req, res, (err) => {
    parseRequestBody(req);
    req.body.message.content = `${req.protocol}://${req.get(
      "host"
    )}/uploads/conversations/${conversationId}/${messageType}/${
      req.file?.filename as string
    }`;
    next();
  });
};

export default messageMiddleware;
