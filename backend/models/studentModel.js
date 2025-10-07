import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;
