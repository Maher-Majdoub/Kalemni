import mongoose from "mongoose";
import { httpServer } from "./app";

const dbUrl = "mongodb://localhost/Kalemni";
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const db = await mongoose.connect(dbUrl);
    console.log("Connected to the database.");
    await httpServer.listen(port);
    console.log(`listening on port ${port}...`);
  } catch (err) {
    console.log(err);
  }
};

start();
