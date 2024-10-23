import mongoose, { Model, Schema, Types } from "mongoose";
import Joi from "joi";
import { extractJoiErrors } from "../utils";

export interface IUserSnapshot {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
}

export const userSnapshotFields = [
  "_id",
  "firstName",
  "lastName",
  "bio",
  "profilePicture",
];

export interface IUser extends IUserSnapshot {
  username: string;
  password: string;
  birthDate?: Date;
  gender: "m" | "f";
  friends: any;
  friendRequests: {
    _id: Types.ObjectId;
    user: any;
  }[];
}

interface IUserMethods {
  getSnapshot(): IUserSnapshot;
}

type UserModel = Model<IUser, {}, IUserMethods>;

export const userSnapshotSchema = new Schema({
  _id: { type: Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
});

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ["m", "f"] },
    friends: [{ type: Types.ObjectId, ref: "User" }],
    friendRequests: [
      {
        _id: { type: Types.ObjectId, default: new Types.ObjectId() },
        user: { type: Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.method("getSnapshot", function getSnapshot() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    bio: this.bio,
    profilePicture: this.profilePicture,
  };
});

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

export const validateUpdateProfileInfosData = (data: object) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    bio: Joi.string().allow(null, "").optional(),
    birthDate: Joi.date().allow(null).optional(),
    gender: Joi.string().allow(null).optional(),
  });
  return extractJoiErrors(schema.validate(data, { abortEarly: false }).error);
};

export const validateUpdateLoginInfosData = (data: object) => {
  const schema = Joi.object({
    newUsername: Joi.string().allow("", null).optional(),
    newPassword: Joi.string().allow("", null).optional(),
    oldPassword: Joi.string().required(),
  });

  return extractJoiErrors(schema.validate(data, { abortEarly: false }).error);
};
