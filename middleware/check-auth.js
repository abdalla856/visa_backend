import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";
export const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    
   
    req.userData = { userId: decodedToken.userId };
    console.log(req.userData);

    return next();
  } catch (err) {
    // const error = new HttpError("Authentication failed!!", 401);
    return next(err.message);
  }
};
