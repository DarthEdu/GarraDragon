import mongoose, { Schema, model } from "mongoose";

const aportacionSchema = new Schema(
  {
    descripcion: {
      type: String,
      require: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      require: true,
      default: true,
    },
    tipoAportacion: {
      type: String,
      require: true,
      enum: ["Tianlong", "Colacuerno", "Celestial"],
    },
    aportante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aportante",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Aportacion", aportacionSchema);
