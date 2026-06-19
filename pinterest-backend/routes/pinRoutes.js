const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getPins,
    createPin,
    deletePin,
    updatePin,
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

router.get(
  "/admin",
  verificarToken,
  authorizeRoles("admin"),
  getPins
);

router.delete(
  "/:id",
  verificarToken,
  authorizeRoles("admin"),
  deletePin
);

// actualizar pin (propietario o admin)
router.put(
  "/:id",
  verificarToken,
  authorizeRoles("usuario", "admin"),
  updatePin
);

module.exports = router;