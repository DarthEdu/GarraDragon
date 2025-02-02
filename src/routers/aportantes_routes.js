import { Router } from "express";
const router = Router();

import {
  actualizarAportante,
  detalleAportante,
  eliminarAportante,
  listarAportantes,
  registrarAportante,
  loginAportante,
  perfilAportante,
} from "../controllers/aportante_controller.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

router.post("/aportante/login", loginAportante);
router.get("/aportante/perfil", verificarAutenticacion, perfilAportante);
router.get("/aportantes", verificarAutenticacion, listarAportantes);
router.get("/aportante/:id", verificarAutenticacion, detalleAportante);
router.post("/aportante/registro", verificarAutenticacion, registrarAportante);
router.put(
  "/aportante/actualizar/:id",
  verificarAutenticacion,
  actualizarAportante
);
router.delete(
  "/aportante/eliminar/:id",
  verificarAutenticacion,
  eliminarAportante
);

export default router;
