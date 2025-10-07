import express from "express";
import multer from "multer";
import {
  getCountries,
  addCountry,
  updateCountry,
  deleteCountry
} from "../controllers/countryController.js";

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get("/", getCountries);
router.post("/", upload.single("image"), addCountry);
router.put("/", upload.single("image"), updateCountry);
router.delete("/:id", deleteCountry);

export default router;
