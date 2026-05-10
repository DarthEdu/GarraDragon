import Invitacion from "../models/invitacion.js";

const generarCodigo = async (req, res) => {
  try {
    const { rol } = req.body;
    
    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const nuevaInvitacion = new Invitacion({
      codigo,
      rol: rol || "tesorero",
      creadoPor: req.tesoreroBDD._id,
      expiresAt,
    });

    await nuevaInvitacion.save();

    res.status(201).json({
      codigo,
      expiresAt,
      rol: nuevaInvitacion.rol,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al generar código de invitación" });
  }
};

const validarCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    const invitacion = await Invitacion.findOne({ codigo });

    if (!invitacion) {
      return res.status(404).json({ msg: "Código de invitación no válido" });
    }

    if (invitacion.usado) {
      return res.status(400).json({ msg: "Este código ya ha sido utilizado" });
    }

    if (new Date() > invitacion.expiresAt) {
      return res.status(400).json({ msg: "El código ha expirado" });
    }

    res.status(200).json({
      valido: true,
      rol: invitacion.rol,
      expiresAt: invitacion.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al validar código de invitación" });
  }
};

const listarInvitaciones = async (req, res) => {
  try {
    const invitaciones = await Invitacion.find({ creadoPor: req.tesoreroBDD._id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json(invitaciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar invitaciones" });
  }
};

const marcarUsado = async (codigo) => {
  await Invitacion.findOneAndUpdate(
    { codigo },
    { usado: true },
    { new: true }
  );
};

export { generarCodigo, validarCodigo, listarInvitaciones, marcarUsado };