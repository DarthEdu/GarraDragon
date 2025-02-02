// Importar Router de Express
import { Router } from "express";
// Crear una instancia de Router()
const router = Router();
// Importar los métodos del controlador
import {
  login,
  perfil,
  registro,
  confirmEmail,
  listarTesoreros,
  detalleTesorero,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
} from "../controllers/tesorero_controller.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

// Rutas publicas
router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/tesoreros", listarTesoreros);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

// Rutas privadas
router.get("/perfil", verificarAutenticacion, perfil);
router.put(
  "/tesorero/actualizar-password",
  verificarAutenticacion,
  actualizarPassword
);
router.get("/tesorero/:id", verificarAutenticacion, detalleTesorero);
router.put("/tesorero/:id", verificarAutenticacion, actualizarPerfil);

// Exportar la variable router
export default router;
