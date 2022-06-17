import mongoose from "mongoose";

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  type: { type: String, required: false },
  photo: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  passport: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  RegSlip: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  matric: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  ExamSlip: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  Verfication: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  offerLetter: {
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  new: { type: Boolean, required: true },
  re_upload: { type: Boolean, required: true },
  payment: { type: Boolean, required: true },
  payment_upload: { type: Boolean, required: true },
  re_upload_uploads: { type: Boolean, required: true },
  finished: { type: Boolean, required: true },
  new_date:{type:Date , required:true},
  reupload_date:{type:Date },
  payment_date:{type:Date },
  finish_date:{type:Date },
  bankPayment: {
    amount: { type: String, required: false },
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  ecomPayment: {
    amount: { type: String, required: false },
    path: { type: String, required: false },
    accept: { type: Boolean, required: false },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "Student" },
});

const App = mongoose.model("App", applicationSchema);
export default App;