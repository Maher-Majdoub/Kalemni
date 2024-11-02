import { Request, Response, NextFunction } from "express";
import multer from "multer";
import supabase from "../supabase";

const prepareStorage = () => {
  const storage = multer.memoryStorage();
  return multer({ storage, limits: { fileSize: 1 * 1024 * 1024 } });
};

export const uploadProfilePictureMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const upload = prepareStorage();
  upload.single("picture")(req, res, async (err) => {
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

    req.body = { ...req.body, ...body, filePath: file.publicUrl };
    next();
  });
};
