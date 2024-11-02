import multer from "multer";
import { NextFunction, Request, Response } from "express";
import supabase from "../supabase";

const prepareStorage = () => {
  const storage = multer.memoryStorage();
  return multer({ storage, limits: { fileSize: 1 * 1024 * 1024 } });
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

  const upload = prepareStorage();

  upload.single(messageType)(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large" });
    }
    const { originalname, buffer } = req.file as Express.Multer.File;

    const filePath = `${Date.now()}-${originalname}`;

    const { data, error } = await supabase.storage
      .from("kalemni")
      .upload(filePath, buffer, {
        contentType: req.file?.mimetype,
        upsert: false,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: file } = supabase.storage
      .from("kalemni")
      .getPublicUrl(data.path);

    parseRequestBody(req);
    req.body.message.content = file.publicUrl;
    next();
  });
};

export default messageMiddleware;
