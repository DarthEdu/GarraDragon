import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const aportanteSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    matricula: {
      type: String,
      required: true,
      unique: true,
    },
    telefono: {
      type: Number,
      trim: true,
      default: null,
    },

    password: {
      type: String,
      require: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    token: {
      type: String,
      default: null,
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    estadoAportacion: {
      type: String,
      enum: ["Al día", "En deuda", "Pendiente"],
      default: "Pendiente",
    },
    aportaciones: [
      {
        type: Schema.Types.ObjectId,
        ref: "Aportacion",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Método para cifrar el password del aportante
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

// Método para crear un token
aportanteSchema.methods.crearToken = function () {
  const tokenGenerado = (this.token = Math.random().toString(36).slice(2));
  return tokenGenerado;
};

export default model("Aportante", aportanteSchema);
