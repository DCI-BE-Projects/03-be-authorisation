import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoute.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected and server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
