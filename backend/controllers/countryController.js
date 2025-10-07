import Country from "../models/Country.js";

// Get all countries
export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add country
export const addCountry = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and image required" });
    }

    const existing = await Country.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Country already exists" });
    }

    const country = new Country({
      name,
      image: req.file.filename
    });

    await country.save();
    res.status(201).json({ message: "Country added successfully", country });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update country
export const updateCountry = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ message: "Id and name required" });
    }

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    country.name = name;
    if (req.file) {
      country.image = req.file.filename;
    }

    await country.save();
    res.status(200).json({ message: "Country updated successfully", country });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete country
export const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByIdAndDelete(id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
