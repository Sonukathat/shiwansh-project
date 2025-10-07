import Location from "../models/Location.js";

// Get all countries with states
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new country
export const addCountry = async (req, res) => {
  try {
    const { country } = req.body;
    if (!country) return res.status(400).json({ message: "Country required" });

    const existing = await Location.findOne({ country });
    if (existing) return res.status(400).json({ message: "Country already exists" });

    const newLocation = new Location({ country, states: [] });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add state to a country
export const addState = async (req, res) => {
  try {
    const { country, state } = req.body;
    if (!country || !state) return res.status(400).json({ message: "Country and state required" });

    const location = await Location.findOne({ country });
    if (!location) return res.status(404).json({ message: "Country not found" });

    if (!location.states.includes(state)) {
      location.states.push(state);
      await location.save();
    }

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update states of a country
export const updateStates = async (req, res) => {
  try {
    const { country, states } = req.body;
    const location = await Location.findOne({ country });
    if (!location) return res.status(404).json({ message: "Country not found" });

    location.states = states;
    await location.save();
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a state from a country
export const deleteState = async (req, res) => {
  try {
    const { country, state } = req.body;
    const location = await Location.findOne({ country });
    if (!location) return res.status(404).json({ message: "Country not found" });

    location.states = location.states.filter((s) => s !== state);
    await location.save();
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete entire country
export const deleteCountry = async (req, res) => {
  try {
    const { countryName } = req.params;
    const deleted = await Location.findOneAndDelete({ country: countryName });
    if (!deleted) return res.status(404).json({ message: "Country not found" });

    res.status(200).json({ message: "Country deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
