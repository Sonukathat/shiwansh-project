import express from "express";
import multer from "multer";
import path from "path";
import { getUsers, addUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage });

// Routes
router.get("/", getUsers);
router.post("/", upload.single("image"), addUser);
router.put("/:id", upload.single("image"), updateUser);
router.delete("/:id", deleteUser);

export default router;
