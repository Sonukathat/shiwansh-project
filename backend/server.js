import express from 'express'

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("rdtfghbnklm,;");
})

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`server running on port no ${PORT}`);
})