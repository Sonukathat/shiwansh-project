import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);         // Create
router.get("/", getEmployees);           // Read all
router.get("/:id", getEmployeeById);     // Read one
router.put("/:id", updateEmployee);      // Update
router.delete("/:id", deleteEmployee);   // Delete

export default router;
