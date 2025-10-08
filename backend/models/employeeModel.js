import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  language: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
