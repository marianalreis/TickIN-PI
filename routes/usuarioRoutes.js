const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/", usuarioController.getAllUsuarios);
router.get("/:cpf", usuarioController.getUsuarioByCPF);
router.post("/", usuarioController.createUsuario);
router.put("/:cpf", usuarioController.updateUsuario);
router.delete("/:cpf", usuarioController.deleteUsuario);

// Rotas de autenticação
router.post("/login", usuarioController.loginUsuario);
router.post("/logout", usuarioController.logoutUsuario);

module.exports = router;
