import Aportante from "../models/aportante.js";
import {
  sendMailToUser,
  sendMailToRecoveryPassword,
} from "../config/nodemailer.js";
import generarJWT from "../helpers/createJWT.js";
import mongoose from "mongoose";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const aportanteBDD = await Aportante.findOne({ email }).select(
    "-status -__v -token -updatedAt -createdAt"
  );
  if (aportanteBDD?.confirmEmail === false)
    return res
      .status(403)
      .json({ msg: "Lo sentimos, debe verificar su cuenta" });
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
  const { nombre, apellido, matricula, telefono, _id } = aportanteBDD;
  res.status(200).json({
    token,
    nombre,
    apellido,
    matricula,
    telefono,
    _id,
    email: aportanteBDD.email,
  });
};
const perfil = (req, res) => {
  delete req.aportanteBDD.token;
  delete req.aportanteBDD.confirmEmail;
  delete req.aportanteBDD.createdAt;
  delete req.aportanteBDD.updatedAt;
  delete req.aportanteBDD.__v;
  res.status(200).json(req.aportanteBDD);
};

const registro = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const verificarEmailBDD = await Aportante.findOne({ email });
  if (verificarEmailBDD)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
  const nuevoAportante = new Aportante(req.body);
  nuevoAportante.password = await nuevoAportante.encrypPassword(password);
  nuevoAportante.crearToken();
  await nuevoAportante.save();
  res.status(200).json({ nuevoAportante });

  const token = nuevoAportante.crearToken();
  await sendMailToUser(email, token);
  await nuevoAportante.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};

const confirmEmail = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const aportanteBDD = await Aportante.findOne({ token: req.params.token });
  if (!aportanteBDD?.token)
    return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });
  aportanteBDD.token = null;
  aportanteBDD.confirmEmail = true;
  await aportanteBDD.save();
  res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};
const listarAportantes = (req, res) => {
  res.status(200).json({ res: "lista de aportantes registrados" });
};

const detalleAportante = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
  const aportanteBDD = await Aportante.findById(id).select("-password");
  if (!aportanteBDD)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el aportante ${id}` });
  res.status(200).json({ msg: aportanteBDD });
};

const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const aportanteBDD = await Aportante.findById(id);
  if (!aportanteBDD)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el aportante ${id}` });
  if (aportanteBDD.email != req.body.email) {
    const aportanteBDDMail = await Aportante.findOne({ email: req.body.email });
    if (aportanteBDDMail) {
      return res
        .status(404)
        .json({ msg: `Lo sentimos, el existe ya se encuentra registrado` });
    }
  }
  aportanteBDD.nombre = req.body.nombre || aportanteBDD?.nombre;
  aportanteBDD.apellido = req.body.apellido || aportanteBDD?.apellido;
  aportanteBDD.matricula = req.body.matricula || aportanteBDD?.matricula;
  aportanteBDD.telefono = req.body.telefono || aportanteBDD?.telefono;
  aportanteBDD.email = req.body.email || aportanteBDD?.email;
  await aportanteBDD.save();
  res.status(200).json({ msg: "Perfil actualizado correctamente" });
};

const actualizarPassword = async (req, res) => {
  const aportanteBDD = await Aportante.findById(req.aportanteBDD._id);
  if (!aportanteBDD)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el aportante ${id}` });
  const verificarPassword = await aportanteBDD.matchPassword(
    req.body.passwordactual
  );
  if (!verificarPassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el password actual no es el correcto" });
  aportanteBDD.password = await aportanteBDD.encrypPassword(
    req.body.passwordnuevo
  );
  await aportanteBDD.save();
  res.status(200).json({ msg: "Password actualizado correctamente" });
};

const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const aportanteBDD = await Aportante.findOne({ email });
  if (!aportanteBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  const token = aportanteBDD.crearToken();
  aportanteBDD.token = token;
  await sendMailToRecoveryPassword(email, token);
  await veterinarioBDD.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};

const comprobarTokenPasword = async (req, res) => {
  if (!req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const aportanteBDD = await Aportante.findOne({ token: req.params.token });
  if (aportanteBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  await aportanteBDD.save();

  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

const nuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (password != confirmpassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, los passwords no coinciden" });
  const aportanteBDD = await Aportante.findOne({ token: req.params.token });
  if (aportanteBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  aportanteBDD.token = null;
  aportanteBDD.password = await aportanteBDD.encrypPassword(password);
  await aportanteBDD.save();
  res
    .status(200)
    .json({
      msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password",
    });
};

export {
  login,
  perfil,
  registro,
  confirmEmail,
  listarAportantes,
  detalleAportante,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
};
