import mongoose, { Schema } from "mongoose";
import Joi, { required, string } from "joi";
import { extractJoiErrors } from "../utils";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    friends: {
      type: [
        {
          _id: { type: mongoose.Types.ObjectId, required: true },
          firstName: { type: String, required: true },
          lastName: { type: String, required: true },
        },
      ],
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;

const userAuthJoiObject = {
  username: Joi.string().required(),
  password: Joi.string().required(),
};

export const validateAuthUser = (data: object) => {
  const schema = Joi.object(userAuthJoiObject);

  return extractJoiErrors(schema.validate(data).error);
};

export const validateCreateUser = (data: object) => {
  const schema = Joi.object({
    ...userAuthJoiObject,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  });

  return extractJoiErrors(schema.validate(data).error);
};
