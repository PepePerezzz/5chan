require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const pinRoutes = require("./routes/pinRoutes");
const userRoutes = require("./routes/userRoutes");
const tableroRoutes = require("./routes/tableroRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.use("/api/tableros", tableroRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/users", userRoutes);
app.use("/api/usuarios", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto ${process.env.PORT}`);
});