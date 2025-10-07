import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  image: { type: String, required: true } // store image filename
}, { timestamps: true });

export default mongoose.model("User", userSchema);
