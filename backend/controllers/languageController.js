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
