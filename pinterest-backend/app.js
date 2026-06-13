require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const pinRoutes = require("./routes/pinRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto ${process.env.PORT}`);
});