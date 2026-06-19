const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getUsers,
    deleteUser
} = require("../controllers/userController");

// SOLO ADMIN

router.get(
  "/",
  verificarToken,
  authorizeRoles("admin"),
  getUsers
);

router.delete(
  "/:id",
  verificarToken,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;