import express from "express";
import bodyParser from "body-parser";
import HttpError from "./models/http-error.js";
import studentRoute from "./routes/student-routes.js";
import clerkRoute from "./routes/clerk-routes.js";
import adminRoute from "./routes/admin-routes.js";
import appRoute from "./routes/applications-routes.js";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

app.use("/uploads/files", express.static(path.join("uploads", "files")));
app.use("/uploads/photos", express.static(path.join("uploads", "photos")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use("/students", studentRoute);
app.use("/App", appRoute);
app.use("/clerk", clerkRoute);
app.use("/admin", adminRoute);
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.!!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
app.use((error, req, res, next) => {
  if (req.file) {
    // console.log(1)
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://hallo:eCcMGdb69WsdQSzL@cluster0.up0yr.mongodb.net/VisaApp?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("hallo");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
