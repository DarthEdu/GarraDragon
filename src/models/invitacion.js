import mongoose, { Schema, model } from "mongoose";

const invitacionSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  usado: {
    type: Boolean,
    default: false,
  },
  rol: {
    type: String,
    enum: ["tesorero", "admin"],
    default: "tesorero",
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tesorero",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

invitacionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("Invitacion", invitacionSchema);