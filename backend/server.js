import express from 'express';
import connectDB from './config/db.js';
import languageRoutes from "./routes/languageRoutes.js";


const app = express();
app.use(express.json());

connectDB(); 

app.use("/api/languages", languageRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
