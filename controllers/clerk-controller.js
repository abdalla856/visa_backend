// const { validatorResult } from("express-validator");
import HttpError from "../models/http-error.js";
import mongoose from "mongoose";
import Clerk from "../models/clerk.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

// import jwt from 'jsonwebtoken'
// import App from '../models/application.js'

/// get all the users later will be used in the mangemtn but for n
//  i will use it here so i can see my data

// export const getUsers = async (req, res, next) => {
//   let users
//   try {
//     users = await Student.find({})
//   }catch(err){
//     const error = new HttpError('Feteching users failed , please try agian later' ,
//     500)
//   return next(err)
//   }

//   res.json({ users: users.map(user =>user.toObject({getters :true})) });
// };

///login middleware
export const login = async (req, res, next) => {
  const { staffNum, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await Clerk.findOne({ staffNum: staffNum });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed , please try again later",
      500
    );
    return next(error);
  }
  const match = await bcrypt.compare(password, identifiedUser.password);
  if (!match) {
    const error = new HttpError(
      "Could not identify user , credential seem to be wrog",
      404
    );
    return next(error);
  }

  let token;
  token = jwt.sign(
    { userId: identifiedUser.id, staffNum: identifiedUser.staffNum },
    "supersecret_dont_share",
    { expiresIn: "1h" }
  );
  res.json({
    user: identifiedUser,
    token: token,
  });
};




export const getClerkById = async (req, res, next) => {
  const id = req.params.id;
  let clerk;
  try {
    clerk = await Clerk.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Clerk.",
      500
    );
    return next(error);
  }

  if (!clerk) {
    const error = new HttpError(` Can't find an Clerk with this id`, 404);
    return next(error);
  }
  res.json({ clerk:clerk });
};

