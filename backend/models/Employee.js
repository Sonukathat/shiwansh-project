import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  state: {
    type: String
  },
  district: {
    type: String
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  language: {
     type: [String]  
  }
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
