import { Request, Response } from "express";
import User, {
  validateAuthUser,
  validateCreateUser,
  validateUpdateLoginInfosData,
} from "../models/user.model";
import { hashPassword, makeToken, validatePassword } from "../utils";
import { sendBadRequestResponse, getMe } from "./utils";

export const signup = async (req: Request, res: Response) => {
  const errors = validateCreateUser(req.body);
  if (errors.length) return res.status(400).send({ errors: errors });

  const existUser = await User.exists({ username: req.body.username });
  if (existUser) return res.status(400).send({ message: "username exists" });

  req.body.password = hashPassword(req.body.password);

  const user = await User.create(req.body);
  res.send(user);
};

export const login = async (req: Request, res: Response) => {
  const errors = validateAuthUser(req.body);
  if (errors.length) return res.status(400).send({ errors: errors });

  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send({ message: "User not found." });

  if (!validatePassword(req.body.password, user.password))
    return res.status(400).send({ message: "Invalid password" });

  res.status(201).send({ token: makeToken({ _id: user._id }) });
};

export const updateLoginInfos = async (req: Request, res: Response) => {
  const errors = validateUpdateLoginInfosData(req.body.data);

  if (errors.length) return res.status(400).send({ errors: errors });

  const newPassword = req.body.data.newPassword;
  const newUsername = req.body.data.newUsername;
  const oldPassword = req.body.data.oldPassword;

  if (!newPassword && !newUsername)
    return sendBadRequestResponse("You Should update at least one field", res);

  const me = await getMe(req);

  if (!validatePassword(oldPassword, me.password))
    return sendBadRequestResponse("Old password is incorrect", res);

  if (newPassword) me.password = hashPassword(newPassword);
  if (newUsername) me.username = newUsername;

  await me.save();
  res.send();
};
