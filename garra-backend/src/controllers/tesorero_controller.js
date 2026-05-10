// Importar el modelo
import {
  sendMailToUser,
  sendMailToRecoveryPassword,
} from "../config/nodemailer.js";
import generarJWT from "../helpers/createJWT.js";
import Tesorero from "../models/tesorero.js";
import Invitacion from "../models/invitacion.js";
import mongoose from "mongoose";

// Método para el login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });

  const tesoreroBDD = await Tesorero.findOne({ email }).select(
    "-status -__v -token -updatedAt -createdAt"
  );

  if (tesoreroBDD?.confirmEmail === false)
    return res
      .status(403)
      .json({ msg: "Lo sentimos, debe verificar su cuenta" });

  if (!tesoreroBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

  const verificarPassword = await tesoreroBDD.matchPassword(password);

  if (!verificarPassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el password no es el correcto" });

  const token = generarJWT(tesoreroBDD._id, "tesorero");

  const { nombre, apellido, celular, _id } = tesoreroBDD;

  res.status(200).json({
    token,
    nombre,
    apellido,
    celular,
    _id,
    email: tesoreroBDD.email,
    rol: "tesorero",
  });
};

// Método para mostrar el perfil
const perfil = (req, res) => {
  delete req.tesoreroBDD.token;
  delete req.tesoreroBDD.confirmEmail;
  delete req.tesoreroBDD.createdAt;
  delete req.tesoreroBDD.updatedAt;
  delete req.tesoreroBDD.__v;
  res.status(200).json(req.tesoreroBDD);
};

// Método para el registro
const registro = async (req, res) => {
  // Desestructurar los campos
  const { email, password, codigoInvitacion } = req.body;
  // Validar todos los campos lleno
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });

  if (!codigoInvitacion)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, necesitas un código de invitación" });

  const invitacion = await Invitacion.findOne({ codigo: codigoInvitacion });
  if (!invitacion)
    return res.status(400).json({ msg: "Código de invitación no válido" });

  if (invitacion.usado)
    return res.status(400).json({ msg: "Este código ya ha sido utilizado" });

  if (new Date() > invitacion.expiresAt)
    return res.status(400).json({ msg: "El código ha expirado" });

  // Obtener el usuario de la BDD en base al email
  const verificarEmailBDD = await Tesorero.findOne({ email });
  // Validar que el email sea nuevo
  if (verificarEmailBDD)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el email ya se encuentra registrado" });

  // Crear la instancia del tesorero
  const nuevoTesorero = new Tesorero(req.body);
  // Encriptar el password
  nuevoTesorero.password = await nuevoTesorero.encrypPassword(password);
  //Crear el token
  const token = nuevoTesorero.crearToken();
  // Invocar la función para el envío de correo
  await sendMailToUser(email, token);
  // Guaradar en BDD
  await nuevoTesorero.save();

  // Marcar código como usado
  await Invitacion.findByIdAndUpdate(invitacion._id, { usado: true });

  // Imprimir el mensaje
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};

// Método para confirmar el token
const confirmEmail = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });

  const tesoreroBDD = await Tesorero.findOne({ token: req.params.token });

  if (!tesoreroBDD?.token)
    return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });

  tesoreroBDD.token = null;
  tesoreroBDD.confirmEmail = true;
  await tesoreroBDD.save();

  res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};

// Método para listar tesoreros
const listarTesoreros = (req, res) => {
  res.status(200).json({ res: "lista de tesoreros registrados" });
};

// Método para mostrar el detalle de un tesorero en particular
const detalleTesorero = async (req, res) => {
  const { id } = req.params;
  const tesoreroBDD = await Tesorero.findById(id);
  res.status(200).json(tesoreroBDD);
};

// Método para actualizar el perfil
const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const tesoreroBDD = await Tesorero.findById(id);
  if (!tesoreroBDD)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el tesorero ${id}` });
  if (tesoreroBDD.email != req.body.email) {
    const tesoreroBDDMail = await Tesorero.findOne({ email: req.body.email });
    if (tesoreroBDDMail) {
      return res
        .status(404)
        .json({ msg: `Lo sentimos, el tesorero ya se encuentra registrado` });
    }
  }

  tesoreroBDD.nombre = req.body.nombre || tesoreroBDD?.nombre;
  tesoreroBDD.apellido = req.body.apellido || tesoreroBDD?.apellido;
  tesoreroBDD.celular = req.body.celular || tesoreroBDD?.celular;
  tesoreroBDD.email = req.body.email || tesoreroBDD?.email;
  await tesoreroBDD.save();
  res.status(200).json({ msg: "Perfil actualizado correctamente" });
};

// Método para actualizar el password
const actualizarPassword = async (req, res) => {
  const tesoreroBDD = await Tesorero.findById(req.tesoreroBDD._id);
  if (!tesoreroBDD)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el tesorero ${id}` });
  const verificarPassword = await tesoreroBDD.matchPassword(
    req.body.passwordactual
  );
  if (!verificarPassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el password actual no es el correcto" });
  tesoreroBDD.password = await tesoreroBDD.encrypPassword(
    req.body.passwordnuevo
  );
  await tesoreroBDD.save();
  res.status(200).json({ msg: "Password actualizado correctamente" });
};

// Método para recuperar el password
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const tesoreroBDD = await Tesorero.findOne({ email });
  if (!tesoreroBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  const token = tesoreroBDD.crearToken();
  tesoreroBDD.token = token;
  await sendMailToRecoveryPassword(email, token);
  await tesoreroBDD.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};

// Método para comprobar el token
const comprobarTokenPasword = async (req, res) => {
  if (!req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const tesoreroBDD = await Tesorero.findOne({ token: req.params.token });
  if (tesoreroBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  await tesoreroBDD.save();
  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

// Método para crear el nuevo password
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
  const tesoreroBDD = await Tesorero.findOne({ token: req.params.token });
  if (tesoreroBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  tesoreroBDD.token = null;
  tesoreroBDD.password = await tesoreroBDD.encrypPassword(password);
  await tesoreroBDD.save();
  res
    .status(200)
    .json({
      msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password",
    });
};

// Exportar cada uno de los métodos
export {
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
};
