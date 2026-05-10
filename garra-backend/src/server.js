// Requerir los módulos
import express from "express";
import aportanteRouter from "./routers/aportantes_routes.js";
import tesoreroRouter from "./routers/tesorero_routes.js";
import aportacionRouter from "./routers/aportaciones_routes.js";
import invitacionRouter from "./routers/invitacion_routes.js";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// Inicializaciones
const app = express();
dotenv.config();

// Variables
app.set("port", process.env.PORT || 3000);
app.use(cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.get("/", (req, res) => {
  res.send("Server on");
});

// Rutas Aportantes
app.use("/api", aportanteRouter);
// Rutas Tesorero
app.use("/api", tesoreroRouter);

// Rutas Aportaciones
app.use("/api", aportacionRouter);

// Rutas Invitaciones
app.use("/api", invitacionRouter);

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Exportar la instancia de express por medio de app
export default app;
