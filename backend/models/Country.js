import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Country", countrySchema);
