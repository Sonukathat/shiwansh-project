import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("District", districtSchema);
