import express from "express";
import { addLanguage, getLanguages, getLanguageById, updateLanguage, deleteLanguage } from "../controllers/languageController.js";

const router = express.Router();

// Create
router.post("/add", addLanguage);
// Read all
router.get("/", getLanguages);
// Read one
router.get("/:id", getLanguageById);
// Update
router.put("/:id", updateLanguage);
// Delete
router.delete("/:id", deleteLanguage);

export default router;
