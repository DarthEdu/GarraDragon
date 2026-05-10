import mongoose from "mongoose";
import Aportacion from "../models/aportaciones.js";

// Método para ver el detalle de la aportacion
const detalleAportacion = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe ese plan de aportación` });
  const aportacion = await Aportacion.findById(id).populate(
    "aportante",
    "_id nombre"
  );
  res.status(200).json(aportacion);
};

// Método para crear el plan de aportacion
const registrarAportacion = async (req, res) => {
  const { aportante } = req.body;
  if (!mongoose.Types.ObjectId.isValid(aportante))
    return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
  const aportacion = await Aportacion.create(req.body);
  res
    .status(200)
    .json({
      msg: `Registro exitoso del plan de aportacion ${aportacion._id}`,
      aportacion,
    });
};

// Método para actualizar el plan de aportacion
const actualizarAportacion = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el plan de aportacion ${id}` });
  await Aportacion.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ msg: "Actualización exitosa del plan de Aportacion" });
};

// Método para eliminar el plan de aportacion
const eliminarAportacion = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el plan de aportacion ${id}` });
  await Aportacion.findByIdAndDelete(req.params.id);
  res.status(200).json({ msg: "Plan de aportacion eliminado exitosamente" });
};

// Método para cambiar el estado del plan de aportacion
const cambiarEstado = async (req, res) => {
  await Aportacion.findByIdAndUpdate(req.params.id, { estado: false });
  res
    .status(200)
    .json({ msg: "Estado del Plan de Aportacion modificado exitosamente" });
};

export {
  detalleAportacion,
  registrarAportacion,
  actualizarAportacion,
  eliminarAportacion,
  cambiarEstado,
};
