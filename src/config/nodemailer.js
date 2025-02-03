import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  },
});

const sendMailToUser = (userMail, token) => {
  let mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: "Verifica tu cuenta",
    html: `
      <h1>Sistema de gestión de Aportaciones (GARRA-DRAGON 🐲 💖)</h1>
      <hr>
      <a href=${process.env.URL_BACKEND}confirmar/${encodeURIComponent(
      token
    )}> Click aquí para confirmar tu cuenta.</a>
      <footer>Dragon te da la Bienvenida!</footer>
      `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
};

// send mail with defined transport object
const sendMailToRecoveryPassword = async (userMail, token) => {
  let info = await transporter.sendMail({
    from: "admin@garra.com",
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión de Aportaciones (GARRA-DRAGON 🐲 💖)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Dragon te da la Bienvenida!</footer>
    `,
  });
  console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

// send mail to patient
const sendMailToAportante = async (userMail, password) => {
  let info = await transporter.sendMail({
    from: "admin@garra.com",
    to: userMail,
    subject: "Correo de bienvenida",
    html: `
  <h1>Sistema de gestión de Aportaciones (GARRA-DRAGON 🐲 💖)</h1>
  <hr>
  <p>Contraseña de acceso: ${password}</p>
  <a href=${process.env.URL_BACKEND}aportante/login>Clic para iniciar sesión</a>
  <hr>
  <footer>Dragon te da la Bienvenida!</footer>
  `,
  });
  console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

export { sendMailToUser, sendMailToRecoveryPassword, sendMailToAportante };
