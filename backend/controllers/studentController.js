import Student from "../models/studentModel.js";

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add student
export const addStudent = async (req, res) => {
  try {
    const { name, email, mobile, country, state, district, gender } = req.body;

    const newStudent = new Student({ name, email, mobile, country, state, district, gender });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, country, state, district, gender } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, mobile, country, state, district, gender },
      { new: true }
    );

    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const searchStudents = async (req, res) => {
  try {
    const { name, email, mobile, country, state, district } = req.query;

    // Build filter dynamically
    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" }; // case-insensitive
    if (email) filter.email = { $regex: email, $options: "i" };
    if (mobile) filter.mobile = { $regex: mobile, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };

    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};