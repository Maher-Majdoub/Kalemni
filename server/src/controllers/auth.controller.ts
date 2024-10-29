import { Request, Response } from "express";
import User, {
  validateAuthUser,
  validateCreateUser,
  validateUpdateLoginInfosData,
} from "../models/user.model";
import { hashPassword, makeToken, validatePassword } from "../utils";
import { sendBadRequestResponse } from "./utils";

export const signup = async (req: Request, res: Response) => {
  const errors = validateCreateUser(req.body);
  if (errors.length) return res.status(400).send({ errors: errors });

  const existUser = await User.exists({ username: req.body.username });
  if (existUser) return res.status(400).send({ message: "username exists" });

  req.body.password = hashPassword(req.body.password);

  const user = await User.create(req.body);
  res.send({ token: makeToken({ _id: user._id }) });
};

export const login = async (req: Request, res: Response) => {
  const errors = validateAuthUser(req.body);
  if (errors.length) return res.status(400).send({ errors: errors });

  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.status(400).send({ message: "User not found." });

  if (!validatePassword(req.body.password, user.password as string))
    return res.status(400).send({ message: "Invalid password" });

  res.status(201).send({ token: makeToken({ _id: user._id }) });
};

export const updateLoginInfos = async (req: Request, res: Response) => {
  const errors = validateUpdateLoginInfosData(req.body.data);

  if (errors.length) return res.status(400).send({ errors: errors });

  const newPassword = req.body.data.newPassword;
  const newUsername = req.body.data.newUsername;
  const oldPassword = req.body.data.oldPassword;

  if (newPassword && (newPassword.length < 5 || newPassword.length > 30))
    return res
      .status(400)
      .send({ message: "Password Length should be between 5 and 30" });

  if (newUsername && (newUsername.length < 5 || newUsername.length > 30))
    return res
      .status(400)
      .send({ message: "User name Length should be between 5 and 30" });

  if (!newPassword && !newUsername)
    return sendBadRequestResponse("You Should update at least one field", res);

  const me = await User.findById(req.body.user._id);
  if (!me) return res.status(505).send({ message: "Something Went Wrong" });

  if (me.authType !== "normal")
    return res.status(400).send({ message: "Invalid Operation" });

  if (!validatePassword(oldPassword, me.password as string))
    return sendBadRequestResponse("Old password is incorrect", res);

  if (newPassword) me.password = hashPassword(newPassword);
  if (newUsername) me.username = newUsername;

  await me.save();
  res.send();
};

export const googleLogin = async (req: Request, res: Response) => {
  const accessToken = req.body.accessToken;

  if (!accessToken) return res.status(400).send({ message: "Invalid Token" });

  const data = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());

  const user = await User.findOne({ sub: data.sub });

  if (user) return res.send({ token: makeToken({ _id: user._id }) });

  const newUser = await User.create({
    authType: "google",
    sub: data.sub,
    firstName: data.given_name,
    lastName: data.family_name,
  });

  res.send({ token: makeToken({ _id: newUser._id }) });
};
