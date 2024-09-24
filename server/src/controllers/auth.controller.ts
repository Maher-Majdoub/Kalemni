import { Request, Response } from "express";
import User, {
  validateAuthUser,
  validateCreateUser,
} from "../models/user.model";
import { hashPassword, makeToken, validatePassword } from "../utils";

class AuthController {
  signup = async (req: Request, res: Response) => {
    const errors = validateCreateUser(req.body);
    if (errors.length) return res.status(400).send({ errors: errors });

    const existUser = await User.exists({ username: req.body.username });
    if (existUser) return res.status(400).send({ message: "username exists" });

    req.body.password = hashPassword(req.body.password);

    const user = await User.create(req.body);
    res.send(user);
  };

  login = async (req: Request, res: Response) => {
    const errors = validateAuthUser(req.body);
    if (errors.length) return res.status(400).send({ errors: errors });

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send({ message: "User not found." });

    if (!validatePassword(req.body.password, user.password))
      return res.status(400).send({ message: "Invalid password" });

    res.status(201).send({ token: makeToken({ _id: user._id }) });
  };
}

export default AuthController;
