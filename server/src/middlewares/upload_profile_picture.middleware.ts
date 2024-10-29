import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const prepareStorage = (userId: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const rootDir = path.resolve(__dirname, "..");
      const targetDir = `uploads/profilePictures/`;
      const uploadDir = path.join(rootDir, targetDir);

      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      cb(
        null,
        `${userId}_${Date.now()}_${file.originalname.replaceAll(" ", "_")}`
      );
    },
  });
  return multer({ storage, limits: { fileSize: 1 * 1024 * 1024 } });
};

export const uploadProfilePictureMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const upload = prepareStorage(body.user._id);
  upload.single("picture")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large" });
    }

    req.body = { ...req.body, ...body };
    next();
  });
};
