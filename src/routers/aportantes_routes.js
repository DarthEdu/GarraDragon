import { Router } from "express";
const router = Router();

import {
  login,
  perfil,
  registro,
  confirmEmail,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
  listarAportantes,
  detalleAportante,
} from "../controllers/aportante_controller.js";

import verificarAutenticacion from "../middleware/autenticacion.js";

router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/aportantes", listarAportantes);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

router.get("/perfil", verificarAutenticacion, perfil);
router.put(
  "/aportante/actualizarpassword",
  verificarAutenticacion,
  actualizarPassword
);
router.get("/aportante/:id", verificarAutenticacion, detalleAportante);
router.put("/aportante/:id", verificarAutenticacion, actualizarPerfil);

export default router;
