// const { validatorResult } from("express-validator");
import HttpError from "../models/http-error.js";
import mongoose from "mongoose";
import Student from "../models/student.js";
import Clerk from "../models/clerk.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
// import App from '../models/application.js'

/// get all the users later will be used in the mangemtn but for n
//  i will use it here so i can see my data

export const getUsers = async (req, res, next) => {
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


///login middleware
export const login = async (req, res, next) => {
  const { matric, password } = req.body;

  let identifiedStudent;
  console.log(req.body);
  try {
    identifiedStudent = await Student.findOne({ matric: matric });
  } catch (err) {
    const error = new HttpError(
      "Loggin in faild , please try again later",
      500
    );
    return next(error);
  }
  console.log(identifiedStudent);
  const match = await bcrypt.compare(password, identifiedStudent.password);
  if (!match) {
    const error = new HttpError(
      "Could not identify user , credential seem to be wrog",
      404
    );
    return next(error);
  }
  let token;
  token = jwt.sign(
    { userId: identifiedStudent.id, matric: identifiedStudent.matric },
    "supersecret_dont_share",
    { expiresIn: "1h" }
  );
  console.log(token);
  res.json({ user: identifiedStudent, token: token });
};

export const singup = async (res, req, next) => {
  // const {  password ,name } = req.body;
  const student = new Student({
    name: "amin",
    password: "123456",
    matric: "A23CS4009",
    type: "student",
    apps: [],
  });
  try {
    await student.save();
  } catch (err) {
    console.log(err.message);
  }
};


export const getStudentById = async (req, res, next) => {
  const userId = req.params.Sid;
  let student;
  try {
    student = await Student.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a student.",
      500
    );
    return next(error);
  }

  if (!student) {
    const error = new HttpError(` Can't find an student with this id`, 404);
    return next(error);
  }
  res.json({ student });
};


