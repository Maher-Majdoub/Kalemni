import { Request, Response } from "express";
import { getMe } from "./utils";
import User, { validateUpdateProfileInfosData } from "../models/user.model";
import asyncMiddleware from "../middlewares/async.middleware";

export const getProfile = async (req: Request, res: Response) =>
  res.send(await getMe(req));

export const updateProfileInfos = asyncMiddleware(
  async (req: Request, res: Response) => {
    const errors = validateUpdateProfileInfosData(req.body.data);

    if (errors.length) return res.status(400).send({ errors: errors });
    await User.findByIdAndUpdate(req.body.user._id, req.body.data);

    res.status(201).send(req.body.data);
  }
);

export const updateProfilePicture = asyncMiddleware(
  async (req: Request, res: Response) => {
    const filePath = `${req.protocol}://${req.get(
      "host"
    )}/uploads/profilePictures/${req.file?.filename}`;

    await User.findByIdAndUpdate(req.body.user._id, {
      profilePicture: filePath,
    });

    res.send({ picture: filePath });
  }
);

export const deleteProfilePicture = asyncMiddleware(
  async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(req.body.user._id, {
      profilePicture: null,
    });
    res.status(204).send({});
  }
);
