import Language from "../models/Language.js";

export const addLanguage = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Language name is required" });
        }

        const existing = await Language.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Language already exists" });
        }

        const language = new Language({ name });
        await language.save();

        res.status(201).json({ message: "Language added successfully", language });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all languages
export const getLanguages = async (req, res) => {
    try {
        const languages = await Language.find();
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single language by ID
export const getLanguageById = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) return res.status(404).json({ message: "Language not found" });
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a language by ID
export const updateLanguage = async (req, res) => {
    try {
        const language = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!language) return res.status(404).json({ message: "Language not found" });
        res.json(language);
    } catch (error) {
        res.status(400).json({ message: "Server error", error: error.message });
    }
};

// Delete a language by ID
export const deleteLanguage = async (req, res) => {
    try {
        const language = await Language.findByIdAndDelete(req.params.id);
        if (!language) return res.status(404).json({ message: "Language not found" });
        res.json({ message: "Language deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
