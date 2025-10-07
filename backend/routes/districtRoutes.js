import express from "express";
import {
  getDistricts,
  addDistrict,
  updateDistrict,
  deleteDistrict
} from "../controllers/districtController.js";

const router = express.Router();

router.get("/", getDistricts);               // Get all districts
router.post("/", addDistrict);               // Add district
router.put("/:id", updateDistrict);          // Update district by id
router.delete("/:id", deleteDistrict);       // Delete district by id

export default router;
