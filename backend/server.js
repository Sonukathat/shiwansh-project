import express from 'express'
import connectDB from './config/db';

const app = express();
app.use(express.json());

connectDB();

app.get('/',(req,res)=>{
    res.send("rdtfghbnklm,;");
})

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`server running on port no ${PORT}`);
})