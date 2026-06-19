require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const pinRoutes = require("./routes/pinRoutes");
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});