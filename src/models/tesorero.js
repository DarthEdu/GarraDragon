import mongoose, {Schema,model} from 'mongoose'
import bcrypt from "bcryptjs"

const tesoreroSchema = new Schema(
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
      telefono: {
        type: Number,
        trim: true,
        default: null,
      },
      password: {
        type: String,
        required: true,
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
      aportacionesGestionadas: [
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
  


// Método para cifrar el password del paciente
tesoreroSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
tesoreroSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

export default model('Tesorero',tesoreroSchema)
