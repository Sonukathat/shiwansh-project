import express from 'express';
import connectDB from './config/db.js';

const app = express();
app.use(express.json());

connectDB(); 

app.get('/', (req, res) => {
    res.send("Backend working with local MongoDB 🚀");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
