import { Router } from "express";
const router = Router();

import {
  generarCodigo,
  validarCodigo,
  listarInvitaciones,
} from "../controllers/invitacion_controller.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

router.post("/invitacion/generar", verificarAutenticacion, generarCodigo);
router.get("/invitacion/validar/:codigo", validarCodigo);
router.get("/invitacion/listar", verificarAutenticacion, listarInvitaciones);

export default router;