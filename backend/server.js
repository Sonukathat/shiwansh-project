import express from 'express';
import cors from "cors";
import connectDB from './config/db.js';
import languageRoutes from "./routes/languageRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import path from "path";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

connectDB(); 

app.use("/api/languages", languageRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/locations", locationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
