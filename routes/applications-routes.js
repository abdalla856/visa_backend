import express from "express";
// import multer from 'multer'
import { fileUplaod } from "../middleware/file-upload.js";
// import {check} from('express-validator')
import { checkAuth } from "../middleware/check-auth.js";

import {
  getApplicationById,
  getApplicationByType,
  getApplicationByStudentId,
  createVisaApplication,
  createI_kadApplication,
  Reupload,
  makePayment,
  getApplications,
  checkApp
} from "../controllers/applications-controller.js";

const appRoute = express.Router();
// appRoute.use(checkAuth);

appRoute.get('/all',getApplications)
appRoute.get("/:Aid", getApplicationById);

appRoute.get("/app/:type", getApplicationByType);
appRoute.get("/user/:sid", getApplicationByStudentId);

appRoute.post(
  "/visa",
  fileUplaod.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "passport",
      maxCount: 1,
    },
    {
      name: "offerLetter",
      maxCount: 1,
    },
    {
      name: "ExamSlip",
      maxCount: 1,
    },
    {
      name: "matric",
      maxCount: 1,
    },
    {
      name: "Verfication",
      maxCount: 1,
    },
    {
      name: "RegSlip",
      maxCount: 1,
    },
  ]),

  createVisaApplication
);

appRoute.patch(
  "/payment/:pid",

  fileUplaod.fields([{
    name :"bankPayment",
    maxCount :1
  } ,
  {
    name : 'ecomPayment',
    maxCount :1
  }]),
  makePayment,
)


appRoute.patch(
  "/upload/:pid",
  fileUplaod.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "passport",
      maxCount: 1,
    },
    {
      name: "offerLetter",
      maxCount: 1,
    },
    {
      name: "ExamSlip",
      maxCount: 1,
    },
    {
      name: "matric",
      maxCount: 1,
    },
    {
      name: "Verfication",
      maxCount: 1,
    },
    {
      name: "RegSlip",
      maxCount: 1,
    },
    {
      name :"ecomPayment", 
      maxCount :1  },
    {
      name :"bankPayment", 
      maxCount :1  },
  ]),

  Reupload
);
appRoute.post(
  "/ikad",

  fileUplaod.fields([
    ,
    {
      name: "passport",
      maxCount: 1,
    },

    {
      name: "ExamSlip",
      maxCount: 1,
    },
    {
      name: "matric",
      maxCount: 1,
    },

    {
      name: "RegSlip",
      maxCount: 1,
    },
  ]),

  createI_kadApplication
);

appRoute.patch(
  "/check/:pid",
  fileUplaod.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "passport",
      maxCount: 1,
    },
    {
      name: "offerLetter",
      maxCount: 1,
    },
    {
      name: "ExamSlip",
      maxCount: 1,
    },
    {
      name: "matric",
      maxCount: 1,
    },
    {
      name: "Verfication",
      maxCount: 1,
    },
    {
      name: "RegSlip",
      maxCount: 1,
    },
  ]),
  checkApp
)
export default appRoute;
