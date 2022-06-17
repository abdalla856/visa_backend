import express from "express";

import { potoUplaod } from "../middleware/file-upload.js";

import {
  login,
  getStudents,
  deletApp,
  getClerks,
  updateStudent,
  updateClerk,
  deletClerk,
  getApps,
  createStudent,
  deletStudent,
  newClerk,
} from "../controllers/admin-controller.js";

const adminRoute = express.Router();

adminRoute.post("/login", login);
adminRoute.post(
  "/news",
  potoUplaod.fields([
    {
      name: "photo",
    },
  ]),
  createStudent
);
adminRoute.post("/newc", newClerk);
adminRoute.get("/st", getStudents);
adminRoute.get("/ck", getClerks);
adminRoute.get("/apps", getApps);
adminRoute.delete("/delets", deletStudent);
adminRoute.delete("/deletc", deletClerk);
adminRoute.delete("/deleta", deletApp);
adminRoute.put(
  "/updates",
  potoUplaod.fields([
    {
      name: "photo",
    },
  ]),
  updateStudent
);
adminRoute.put("/updatec", updateClerk);

export default adminRoute;
