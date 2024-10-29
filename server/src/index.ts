import config from "config";
import winston from "winston";
import mongoose from "mongoose";
import { httpServer } from "./app";

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

const dbUrl = config.get("dbUrl");
const port = process.env.PORT || 3000;

const start = async () => {
  await mongoose.connect(dbUrl as string);
  console.log("Connected to the database.");
  await httpServer.listen(port);
  console.log(`listening on port ${port}...`);
};

start();
