import { ValidationError } from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface FieldError {
  field: string;
  message: string;
}

export interface Error {
  errors: {
    fieldsErrors?: FieldError[];
    generalError?: {
      message: string;
    };
  };
}

export const extractJoiErrors = (error: ValidationError | undefined) => {
  if (error)
    return error.details.map((err) => {
      return {
        field: err.path[0] as string,
        message: err.message.replaceAll('"', ""),
      } as FieldError;
    });

  return [];
};

export const hashPassword = (password: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const validatePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const makeToken = (data: object) => {
  return jwt.sign(data, "test");
};

interface UserData {
  _id: string;
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, "test");
    return { isValid: true, data: decoded as UserData };
  } catch (ex) {
    return { isValid: false, data: {} as UserData };
  }
};
