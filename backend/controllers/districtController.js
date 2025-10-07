import District from "../models/District.js";

// Get all districts
export const getDistricts = async (req, res) => {
  try {
    const districts = await District.find();
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add district
export const addDistrict = async (req, res) => {
  try {
    const { country, state, district } = req.body;
    if (!country || !state || !district) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await District.findOne({ country, state, district });
    if (exists) return res.status(400).json({ message: "District already exists" });

    const newDistrict = new District({ country, state, district });
    await newDistrict.save();
    res.status(201).json(newDistrict);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update district
export const updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const { country, state, district } = req.body;

    const existing = await District.findById(id);
    if (!existing) return res.status(404).json({ message: "District not found" });

    existing.country = country;
    existing.state = state;
    existing.district = district;

    await existing.save();
    res.status(200).json(existing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete district
export const deleteDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await District.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "District not found" });

    res.status(200).json({ message: "District deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
