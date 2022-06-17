import HttpError from "../models/http-error.js";
import Student from "../models/student.js";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import Clerk from "../models/clerk.js";
import App from "../models/applications.js";
import bcrypt from "bcrypt";
import fs from "fs";
//admin login
export const login = async (req, res, next) => {
  const { name, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await Admin.findOne({ name: name, password: password });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed , please try again later",
      500
    );
    return next(error);
  }

  let token;
  token = jwt.sign(
    { userId: identifiedUser.id, name: identifiedUser.name },
    "supersecret_dont_share",
    { expiresIn: "1h" }
  );
  res.json({
    user: identifiedUser,
    token: token,
  });
};

//get all students

export const getStudents = async (req, res, next) => {
  let users;
  try {
    users = await Student.find({});
  } catch (err) {
    const error = new HttpError(
      "Feteching users failed , please try agian later",
      500
    );
    return next(err);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//get all clerks
export const getClerks = async (req, res, next) => {
  let users;
  try {
    users = await Clerk.find({});
  } catch (err) {
    const error = new HttpError(
      "Feteching users failed , please try agian later",
      500
    );
    return next(err);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//get all apps
export const getApps = async (req, res, next) => {
  let users;
  try {
    users = await App.find({});
  } catch (err) {
    const error = new HttpError(
      "Feteching Apps failed , please try agian later",
      500
    );
    return next(err);
  }

  res.json({ Apps: users.map((user) => user.toObject({ getters: true })) });
};

//add new student

export const createStudent = async (req, res, next) => {
  const saltRounds = 10;
  const {
    fullName,
    faculty,
    major,
    DateOfIssue,
    passport,
    HomeTown,
    address,
    DateOfBirth,
    matric,
  } = req.body;
  console.log(req.files.photo[0].path)
  const photo = req.files.photo[0].path
  const password = matric + "UTM";
  const hash = bcrypt.hashSync(password, saltRounds);
  var foundStudent;
  try {
    foundStudent = await Student.find({ matric: matric });
  } catch (err) {
    const error = new HttpError(
      "Could not identify user , credential seem to be wrog",
      404
    );
    return next(error);
  }
  if (foundStudent.length !== 0) {
    fs.unlinkSync(req.files.photo[0].path, (err) => {
      console.log(err);
    });
    const error = new HttpError("found user with the same matric number", 404);
    return next(error);
  }

  const newStudent = new Student({
    fullName: fullName,
    name: fullName.substring(0, fullName.indexOf(" ")),
    matric: matric,
    DateOfIssue: DateOfIssue,
    passport: passport,
    HomeTown: HomeTown,
    address: address,
    DateOfBirth: DateOfBirth,
    major: major,
    apps: [],
    photo: photo,
    password: hash,
    type: "student",
    faculty: faculty,
  });

  console.log(newStudent);
  try {
    newStudent.save();
  } catch (err) {
    const error = new HttpError("Could not creat new user", 500);
    return next(error);
  }
  res.send("created Successfully").status(200);
};

//delete student

export const deletStudent = async (req, res, next) => {
  const { id } = req.body;

  const keys = [
    "photo",
    "passport",
    "offerLetter",
    "ExamSlip",
    "matric",
    "Verfication",
    "RegSlip",
    "bankPayment",
    "ecomPayment",
  ];
  const student = await Student.findById(id);
  const apps = await App.find({ creator: id });
  console.log(apps)
  if (student.apps.length > 0) {
    apps.forEach((app) => {
      keys.forEach((key) => {
        if (app[key].path !== undefined && app[key].path !== "") {
          console.log(app[key].path);
          fs.unlinkSync(app[key].path, (err) => {
            console.log(err);
          });
        }
      });
    });
  }
  try {
    await Student.deleteOne({ _id: id });
    if (student.apps.length !== 0) {
      await App.deleteMany({ creator: id });
    }
  } catch (err) {
    const error = new HttpError("cound not delete student", 404);
  }
  res.status(200).send("deleted sucessfully");
};

//update student

export const updateStudent = async (req, res, next) => {
  const saltRounds = 10;

  var {
    id,
    fullName,
    faculty,
    major,
    DateOfIssue,
    passport,
    HomeTown,
    address,
    DateOfBirth,
    matric,
    photo
  } = req.body;
  const st = await Student.findById(id)
  console.log(req.files)
  photo = st.photo             
  if(req.files.photo !== undefined){
    var newphoto = req.files.photo[0].path 
    fs.unlinkSync(st.photo, (err) => {
      console.log(err); 
    }
      )
      photo = newphoto
  }
  console.log(req.body)
  var name = undefined;
  if (fullName !== undefined) {
    name =fullName.substring(0, fullName.indexOf(" "));
  }
  var hash = undefined;
  if (matric !== undefined) {
    const password = matric + "UTM";
    hash = bcrypt.hashSync(password, saltRounds);
  }
  console.log(req.body)
  try {
  const st =  await Student.updateMany(
      {
        _id: id,
      },
      {
        $set: {
          fullName: fullName,
          name: name,
          matric: matric,
          DateOfIssue: DateOfIssue,
          passport: passport,
          HomeTown: HomeTown,
          address: address,
          DateOfBirth: DateOfBirth,
          major: major,
          photo: photo,
          password: hash,
          faculty: faculty,
        },
      }
    );
    console.log(st)
  } catch (err) {
    const error = new HttpError("could not update student", 500);
    return next(error);
  }
  res.status(200).send(st);
};

// new clerk

export const newClerk = async (req, res, next) => {
  const saltRounds = 10;
  const { name, staffNum } = req.body;
  console.log(req.body)

  const password = staffNum + "UTM";
  const hash = bcrypt.hashSync(password, saltRounds);
  var foundClerk;
  try {
    foundClerk = await Clerk.find({ staffNum: staffNum });
  } catch (err) {
    const error = new HttpError(
      "Could not identify user , credential seem to be wrog",
      404
    );
    return next(error);
  }
 
  if (foundClerk.length !== 0) {
    const error = new HttpError("found user with the same Staff number", 404);
    return next(error);
  }
  const newClerk = new Clerk({
    name: name,
    staffNum: staffNum,
    password: hash,
    type: "clerk",
  });

  try {
    newClerk.save();
  } catch (err) {
    const error = new HttpError("Could not creat new user", 500);
    return next(error);
  }
  res.send("created Successfully").status(200);
};

//update clerk

export const updateClerk = async (req, res, next) => {
  const saltRounds = 10;

  const { name, staffNum, id } = req.body;
  console.log(req.body)
  var hash = undefined;
  if (staffNum !== undefined) {
    const password = staffNum + "UTM";
    hash = bcrypt.hashSync(password, saltRounds);
  }
  var ck
  try {
  ck=  await Clerk.updateMany(
      {
        _id: id,
      },
      {
        $set: {
          name: name,
          staffNum: staffNum,
          password: hash,
        },
      }
    );
  } catch (err) {
    const error = new HttpError("could not update clerk", 500);
    return next(error);
  }
  console.log('updated')
  res.status(200).send(ck);
};

//delete clerk
export const deletClerk = async (req, res, next) => {
  const { id } = req.body;

  try {
    await Clerk.deleteOne({ _id: id });
  } catch (err) {
    const error = new HttpError("cound not delete clerk", 404);
  }
  res.status(200).send("deleted sucessfully");
};

// delet app

export const deletApp = async (req, res, next) => {
  const { id } = req.body;
  const app = await App.findById(id);
  const keys = [
    "photo",
    "passport",
    "offerLetter",
    "ExamSlip",
    "matric",
    "Verfication",
    "RegSlip",
    "bankPayment",
    "ecomPayment",
  ];
  const { bankPayment } = app;

  if (app !== undefined) {
    keys.forEach((key) => {
      if (app[key].path !== undefined && app[key].path !== "") {
        console.log(app[key].path);
        fs.unlinkSync(app[key].path, (err) => {
          console.log(err);
        });
      }
    });
  }
  try {
    await App.deleteOne({ _id: id });

    await Student.updateOne(
      { _id: app.creator },
      {
        $pullAll: {
          apps: [{ _id: id }],
        },
      }
    );
  } catch (err) {
    const error = new HttpError("cound not delete clerk", 404);
  }
  res.status(200).send("deleted sucessfully");
};
