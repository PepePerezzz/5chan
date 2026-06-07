require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Backend funcionando");
});

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor en puerto ${process.env.PORT}`);
});

app.use("/api/auth", authRoutes);