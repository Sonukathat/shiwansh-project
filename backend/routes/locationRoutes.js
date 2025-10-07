import express from "express";
import {
  getLocations,
  addCountry,
  addState,
  updateStates,
  deleteState,
  deleteCountry
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getLocations);
router.post("/country", addCountry);
router.post("/state", addState);
router.put("/updateState", updateStates);
router.delete("/state", deleteState);
router.delete("/country/:countryName", deleteCountry);

export default router;
