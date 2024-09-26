import mongoose, { Schema, Types } from "mongoose";
import Joi from "joi";
import { extractJoiErrors } from "../utils";

export const userSnapshotSchema = new Schema({
  _id: { type: Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
});

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
    bio: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ["m", "f"] },
    profilePicture: { type: String },
    friends: { type: [userSnapshotSchema] },
    friendRequests: [
      {
        _id: { type: Types.ObjectId, default: new Types.ObjectId() },
        user: userSnapshotSchema,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
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

  return extractJoiErrors(schema.validate(data, { abortEarly: false }).error);
};
