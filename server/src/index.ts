import mongoose from "mongoose";
import { httpServer } from "./app";
import winston from "winston";

export default winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : "mongodb://localhost/Kalemni";
const port = process.env.PORT || 3000;

const start = async () => {
  await mongoose.connect(dbUrl as string);
  console.log("Connected to the database.");
  await httpServer.listen(port);
  console.log(`listening on port ${port}...`);
};

start();
