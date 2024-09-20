// email.js
const nodemailer = require('nodemailer');

// Crie um transportador usando o serviço de e-mail Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587, // Tente porta 587 se a 2525 não funcionar
  auth: {
    user: "fe408af5cd313d", // Substitua pelo usuário correto
    pass: "d13ff0fcb819cb"   // Substitua pela senha correta
  }
});

async function sendResetPasswordEmail(email, resetToken) {
  // Defina o e-mail a ser enviado
  const mailOptions = {
    from: 'fabiocorreia455@gmail.com', // E-mail do remetente
    to: email,                         // E-mail do destinatário (o e-mail fornecido pelo usuário)
    subject: 'Redefinição de Senha',
    text: `Clique no link abaixo para redefinir sua senha:\n\nhttp://localhost:3001/auth/reset-password?token=${resetToken}`
  };

  try {
    // Envie o e-mail
    await transporter.sendMail(mailOptions);
    console.log('Email de redefinição de senha enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error.message);
    throw new Error('Falha ao enviar e-mail de redefinição de senha');
  }
}

module.exports = { sendResetPasswordEmail };
