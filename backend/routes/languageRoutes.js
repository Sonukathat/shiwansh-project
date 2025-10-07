import express from "express";
import { addLanguage } from "../controllers/languageController.js";

const router = express.Router();

router.post("/add", addLanguage);

export default router;
