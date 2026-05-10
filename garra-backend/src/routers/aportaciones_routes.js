import { Router } from "express";
const router = Router();

import {
  detalleAportacion,
  registrarAportacion,
  actualizarAportacion,
  eliminarAportacion,
  cambiarEstado,
} from "../controllers/aportacion_controller.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

// Ruta para crear el plan de aportacion
router.post(
  "/aportacion/registro",
  verificarAutenticacion,
  registrarAportacion
);
// Ruta para ver el detalle del plan de aportacion
router.get("/aportacion/:id", verificarAutenticacion, detalleAportacion);
// Ruta para actualizar el plan de aportacion
router.put("/aportacion/:id", verificarAutenticacion, actualizarAportacion);
// Ruta para eliminar el plan de aportacion
router.delete("/aportacion/:id", verificarAutenticacion, eliminarAportacion);
// Ruta para cambiar el estado del plan de aportacion
router.post("/aportacion/estado/:id", verificarAutenticacion, cambiarEstado);

export default router;
