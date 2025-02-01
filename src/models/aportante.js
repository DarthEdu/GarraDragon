import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const aportanteSchema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true,
    },
    apellido: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    celular: {
      type: String,
      require: true,
      trim: true,
    },
    reserva: {
      type: Date,
      require: true,
      trim: true,
      default: Date.now(),
    },
    entrega: {
      type: Date,
      require: true,
      trim: true,
      default: Date.now(),
    },
    estado: {
      type: Boolean,
      default: true,
    },
    encargado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tesorero",
    },
    rol: {
      type: String,
      default: "aportante",
    },
  },
  {
    timestamps: true,
  }
);

// Método para cifrar el password del paciente
aportanteSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const passwordEncryp = await bcrypt.hash(password, salt);
  return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
aportanteSchema.methods.matchPassword = async function (password) {
  const response = await bcrypt.compare(password, this.password);
  return response;
};

export default model("Aportante", aportanteSchema);
