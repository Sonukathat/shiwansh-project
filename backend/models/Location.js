import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  states: [{ type: String }]
});

export default mongoose.model("Location", locationSchema);
