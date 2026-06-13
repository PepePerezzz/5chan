const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getPins,
    createPin
} = require("../controllers/pinController");

// público (feed)
router.get("/", getPins);

// protegido (crear pins)
router.post(
    "/",
    verificarToken,
    authorizeRoles("usuario", "admin"),
    createPin
);



module.exports = router;