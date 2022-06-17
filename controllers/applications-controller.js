import mongoose from "mongoose";
import FileReader from "filereader";
// const { validationRsult } = fro("express-validator");
import HttpError from "../models/http-error.js";
import App from "../models/applications.js";
import Student from "../models/student.js";
import fs from "fs";

/// get all application

export const getApplications = async (req, res, next) => {
  // const applicationId = req.params.Aid;
  let applications;
  try {
    applications = await App.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an application.",
      500
    );
    return next(error);
  }

  if (!applications) {
    const error = new HttpError(` Can't find an application with this id`, 404);
    return next(error);
  }
  res.json({
    applications: applications.map((app) => app.toObject({ getters: true })),
  });
};
/// get application by id

export const getApplicationById = async (req, res, next) => {
  const applicationId = req.params.Aid;
  let application;
  try {
    application = await App.findById(applicationId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an application.",
      500
    );
    return next(error);
  }

  if (!application) {
    const error = new HttpError(` Can't find an application with this id`, 404);
    return next(error);
  }
  res.json({ application });
};

// get application by type
export const getApplicationByType = async (req, res, next) => {
  const applicationtype = req.params.type;

  let Apps;

  try {
    Apps = await App.find({ type: applicationtype });
  } catch (err) {
    const error = new HttpError(` Can't find an applications `, 404);
    return next(error);
  }

  // console.log(Apps);
  if (!Apps || App.length === 0) {
    const error = new HttpError(
      ` Can't find an application with this type`,
      404
    );
    return next(error);
  }
  res.json({ apps: Apps });
};

// get application by student id

export const getApplicationByStudentId = async (req, res, next) => {
  const studentId = req.params.sid;
  let studentWithApps;
  try {
    studentWithApps = await Student.findById(studentId).populate("apps");
  } catch (err) {
    const error = new HttpError(`Couldn't get the app for the students`, 500);
    return next(error);
  }

  if (!studentWithApps) {
    const error = new HttpError(
      "the student does not have any applications ",
      404
    );
    return next(error);
  }

  res.json({
    application: studentWithApps.apps.map((p) => p.toObject({ getters: true }))[
      studentWithApps.apps.length - 1
    ],
  });
};

//create visa application

export const createVisaApplication = async (req, res, next) => {
  const { creator } = req.body;
  console.log(req.files.photo[0].path);
  const createdApp = new App({
    type: "visa",
    photo: { path: req.files.photo[0].path, accept: true },

    passport: { path: req.files.passport[0].path, accept: true },
    RegSlip: { path: req.files.RegSlip[0].path, accept: true },
    matric: { path: req.files.matric[0].path, accept: true },
    ExamSlip: { path: req.files.ExamSlip[0].path, accept: true },
    Verfication: { path: req.files.Verfication[0].path, accept: true },
    offerLetter: { path: req.files.offerLetter[0].path, accept: true },
    bankPayment: { path: "", accept: true, amount: 0 },
    ecomPayment: { path: "", accept: true, amount: 0 },
    new: true,
    re_upload: false,
    re_upload_uploads: false,
    payment_upload: false,
    payment: false,
    finished: false,
    new_date: new Date(),
    creator,
  });
  console.log(createdApp);
  let student;
  try {
    student = await Student.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating Apps failed, please try again.", 500);
    return next(error);
  }
  // console.log(student)
  if (!student) {
    const error = new HttpError("Could not find student for provided id.", 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createdApp.save({ session: sess });

    student.apps.push(createdApp);

    await Student.updateMany(
      {
        _id: student.id,
      },
      {
        $set: {
          apps: student.apps,
        },
      }
    );
    await sess.commitTransaction();
    console.log("app created");
  } catch (err) {
    const error = new HttpError("Creating app failed, please try again.", 500);
    return next(error);
  }

  // DUMMY_APPS.push(createdApp)
  res.status(201).json({ app: createdApp });
};

//create i-kad application

export const createI_kadApplication = async (req, res, next) => {
  const { creator } = req.body;
  //validation

  const createdApp = new App({
    type: "i-kad",
    passport: { path: req.files.passport[0].path, accept: true },
    RegSlip: { path: req.files.RegSlip[0].path, accept: true },
    matric: { path: req.files.matric[0].path, accept: true },
    ExamSlip: { path: req.files.ExamSlip[0].path, accept: true },
    bankPayment: { path: "", accept: true, amount: 0 },
    ecomPayment: { path: "", accept: true, amount: 0 },
    new: true,
    re_upload: false,
    payment: false,
    payment_upload: false,
    re_upload_uploads: false,
    new_date: new Date(),

    finished: false,

    creator,
  });
  let student;
  try {
    student = await Student.findById(creator);
  } catch (err) {
    const error = new HttpError("Cound not found a user , plz try again ", 500);
    return next(error);
  }

  // console.log(createdApp);
  if (!student) {
    const error = new HttpError("Could not find student for provided id.", 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdApp.save({ session: sess });
    student.apps.push(createdApp);
    console.log(student);

    await Student.updateMany(
      {
        _id: student.id,
      },
      {
        $set: {
          apps: student.apps,
        },
      }
    );
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating app failed, please try again.", 500);
    console.log(err.message);
    return next();
  }

  res.status(201).json({ app: createdApp });
};

export const Reupload = async (req, res, next) => {
  const pid = req.params.pid;
  const {
    newApp,
    payment,
    re_upload,
    finished,
    re_upload_uploads,
    payment_upload,
  } = req.body;
  let app;
  console.log(req.files)
  try {
    app = await App.findById(pid);
    // console.log(app);
  } catch (err) {
    // console.log("hi")
    console.log(err);
  }

  var fileKeys = Object.keys(req.files);

  fileKeys.forEach(function (key) {
    if (req.files[key][0].path) {
      // console.log(1)
      fs.unlink(app[key].path, (err) => {
        console.log(err);
      });
    }
  });

  let createdApp = {};
  let bankPath = app.bankPayment.path;
  let comPath = app.ecomPayment.path;
  fileKeys.forEach(function (key) {
    createdApp[key] = { path: req.files[key][0].path, accept: false };
    if (key === "bankPayment") bankPath = req.files["bankPayment"][0].path;
    // console.log(req.files);
    if (key === "ecomPayment") comPath = req.files["ecomPayment"][0].path;
  });
  // console.log(re_upload_uploads);

  try {
    const doc = await App.updateMany(
      { _id: app.id },
      {
        $set: {
          new: newApp,
          re_upload: re_upload,
          payment: payment,
          finished: finished,
          payment_upload: payment_upload,
          re_upload_uploads: re_upload_uploads,
          passport: createdApp.passport,
          photo: createdApp.photo,
          RegSlip: createdApp.RegSlip,
          matric: createdApp.matric,
          ExamSlip: createdApp.ExamSlip,
          Verfication: createdApp.Verfication,
          offerLetter: createdApp.offerLetter,
          "bankPayment.path": bankPath,
          "ecomPayment.path": comPath,
          reupload_date: new Date(),
        },
      }
    );
    // console.log("hi");
  } catch (err) {
    const error = new HttpError("Upateing app failed, please try again.", 500);
    console.log(error)
    return next(error);
  }

  try {
    app = await App.findById(pid);
    // console.log(app);
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({ app: app });
};


export const makePayment = async (req, res, next) => {
  const pid = req.params.pid;
  const { payment_upload } = req.body;
  let app;
  try {
    app = await App.findById(pid);
    // console.log(app);
  } catch (err) {
    console.log(err);
  }
  console.log(req.files);
  var fileKeys = Object.keys(req.files);

  let createdApp = {};
  fileKeys.forEach(function (key) {
    createdApp[key] = {
      path: req.files[key][0].path,
      accept: true,
      amount: app[key].amount,
    };
  });
  console.log(createdApp);

  try {
    const doc = await App.updateMany(
      { _id: app.id },
      {
        $set: {
          bankPayment: createdApp.bankPayment,
          ecomPayment: createdApp.ecomPayment,
          payment_upload: payment_upload,
          payment_date: new Date(),
        },
      }
    );
    // console.log(doc);
  } catch (err) {
    const error = new HttpError(
      "Upateing Payment failed, please try again.",
      500
    );
    return next(error);
  }
  try {
    app = await App.findById(pid);
    // console.log(app);
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({ app: app });
};

export const checkApp = async (req, res, next) => {
  console.log('hi')
  const {
    newApp,
    payment,
    passportAccept,
    offerLetterAccept,
    ExamSlipAccept,
    matricAccept,
    VerficationAccept,
    RegSlipAccept,
    bankPaymentAccept,
    ecomPaymentAccept,
    re_upload,
    finished,
    EcommerceAccept,
    bankAccept,
    photoAccept,
    re_upload_uploads,
    payment_upload,
  } = req.body;
  console.log(req.body);



  const pid = req.params.pid;
  let app;
  try {
    app = await App.findById(pid);
    // console.log(app);
  } catch (err) {
    // console.log("hi")
    console.log(err);
  }

  try {
   
    const doc = await App.updateMany(
      { _id: app.id },
      {
        $set: {
          "passport.accept": passportAccept,
          "photo.accept": photoAccept,
          "RegSlip.accept": RegSlipAccept,
          "matric.accept": matricAccept,
          "ExamSlip.accept": ExamSlipAccept,
          "Verfication.accept": VerficationAccept,
          "offerLetter.accept": offerLetterAccept,
          "bankPayment.amount": bankPaymentAccept,
          "bankPayment.accept": bankAccept,
          "ecomPayment.amount": ecomPaymentAccept,
          "ecomPayment.accept": EcommerceAccept,
          new: newApp,
          re_upload: re_upload,
          payment: payment,
          finished: finished,
          payment_upload: payment_upload,
          re_upload_uploads: re_upload_uploads,
          reupload_date: new Date(),
        },
      }
      );
      // console.log(doc);
  } catch (err) {
    const error = new HttpError("Upateing app failed, please try again.", 500);
    console.log(error)
    return next(error);
  }

  try {
    app = await App.findById(pid);
    console.log(app)
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({ app: app });
};
