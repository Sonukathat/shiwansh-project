import express from "express";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/search", searchStudents); // 🔹 Add this route
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
