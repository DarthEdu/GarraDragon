import jwt from "jsonwebtoken";
import Aportante from "../models/aportante.js";

const verificarAutenticacion = async (req, res, next) => {
  if (!req.headers.authorization)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes proprocionar un token" });
  const { authorization } = req.headers;
  try {
    const { id, rol } = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (rol === "aportante") {
      req.aportanteBDD = await Aportante.findById(id)
        .lean()
        .select("-password");
      next();
    }
  } catch (error) {
    const e = new Error("Formato del token no válido");
    return res.status(404).json({ msg: e.message });
  }
};

export default verificarAutenticacion;
