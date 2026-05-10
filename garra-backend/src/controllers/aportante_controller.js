import Aportante from "../models/aportante.js";
import Aportacion from "../models/aportaciones.js";

// IMPORTAR EL MÉTODO sendMailToPaciente
import { sendMailToAportante } from "../config/nodemailer.js";
import mongoose from "mongoose";
import generarJWT from "../helpers/createJWT.js";

// Método para el proceso de login
const loginAportante = async (req, res) => {
  const { email, password } = req.body;

  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });

  const aportanteBDD = await Aportante.findOne({ email });

  if (!aportanteBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

  const verificarPassword = await aportanteBDD.matchPassword(password);

  if (!verificarPassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el password no es el correcto" });

  const token = generarJWT(aportanteBDD._id, "aportante");

  const { nombre, apellido, email: emailP, celular, _id } = aportanteBDD;

  res.status(200).json({
    token,
    nombre,
    apellido,
    emailP,
    celular,
    rol: "aportante",
    _id,
  });
};

// Método para ver el perfil
const perfilAportante = (req, res) => {
  delete req.aportanteBDD.reserva;
  delete req.aportanteBDD.entrega;
  delete req.aportanteBDD.estado;
  delete req.aportanteBDD.encargado;
  delete req.aportanteBDD.createdAt;
  delete req.aportanteBDD.updatedAt;
  delete req.aportanteBDD.__v;
  res.status(200).json(req.aportanteBDD);
};

// Método para listar todos los aportantes
const listarAportantes = async (req, res) => {
  if (req.aportanteBDD && "celular" in req.aportanteBDD) {
    const aportantes = await Aportante.find(req.aportanteBDD._id)
      .select("-entrega -createdAt -updatedAt -__v")
      .populate('encargado', '_id nombre apellido');
    res.status(200).json(aportantes);
  } else {
    const aportantes = await Aportante.find({ estado: true })
      .where('encargado')
      .equals(req.tesoreroBDD)
      .select("-entrega -createdAt -updatedAt -__v")
      .populate('encargado', '_id nombre apellido');
    res.status(200).json(aportantes);
  }
};

// Método para ver el detalle de un aportante en particular
const detalleAportante = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el aportante ${id}` });
  const aportante = await Aportante.findById(id)
    .select("-createdAt -updatedAt -__v")
    .populate("encargado", "_id nombre apellido");
  const aportaciones = await Aportacion.find({ estado: true })
    .where("aportante")
    .equals(id);
  res.status(200).json({
    aportante,
    aportaciones,
  });
};

// Método para registrar un aportante
const registrarAportante = async (req, res) => {
  // desestructurar el email
  const { email } = req.body;
  //  Validar todos los camposs
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  // Obtener el usuario en base al email
  const verificarEmailBDD = await Aportante.findOne({ email });
  // Verificar si el aportante ya se encuentra registrado
  if (verificarEmailBDD)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
  // Crear una instancia del Paciente
  const nuevoAportante = new Aportante(req.body);
  // Crear un password
  const password = Math.random().toString(36).slice(2);
  console.log(password);
  // Encriptar el password
  nuevoAportante.password = await nuevoAportante.encrypPassword(
    "esfot" + password
  );
  // Enviar el correo electrónico
  await sendMailToAportante(email, "esfot" + password);
  // Asociar al aportante con el encargado de la entrega
  nuevoAportante.encargado = req.tesoreroBDD._id;
  // Guardar en BDD
  await nuevoAportante.save();
  // Presentar resultados
  res
    .status(200)
    .json({ msg: "Registro exitoso del aportante y correo enviado" });
};

// Método para actualizar un aportante
const actualizarAportante = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el aportante ${id}` });
  await Aportante.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ msg: "Actualización exitosa del aportante" });
};

// Método para eliminar(dar de baja) un aportante
const eliminarAportante = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el aportante ${id}` });
  const { entrega } = req.body;
  await Aportante.findByIdAndUpdate(req.params.id, {
    entrega: Date.parse(entrega),
    estado: false,
  });
  res
    .status(200)
    .json({ msg: "Fecha de entrega del aportante registrado exitosamente" });
};

export {
  loginAportante,
  perfilAportante,
  listarAportantes,
  detalleAportante,
  registrarAportante,
  actualizarAportante,
  eliminarAportante,
};
