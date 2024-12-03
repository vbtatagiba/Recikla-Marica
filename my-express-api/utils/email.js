const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Configuração do transportador
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'reciklamarica@gmail.com',
    pass: 'mpktsbgiqzlratbk',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Lê e processa o template HTML.
 */
function renderTemplate(templateName, variables) {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  console.log('Caminho do template:', templatePath);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template não encontrado: ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, variables[key]);
  });

  return template;
}

/**
 * Envia um e-mail de redefinição de senha.
 */
async function sendResetPasswordEmail(email, resetToken) {
  const htmlContent = renderTemplate('resetPassword', {
    resetUrl: `http://localhost:3000/auth/reset-password?token=${resetToken}`,
  });

  const mailOptions = {
    from: '"Recikla Maricá" <reciklamarica@gmail.com>',
    to: email,
    subject: 'Redefinição de Senha - Recikla Maricá',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de redefinição de senha enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error.message);
    throw new Error('Falha ao enviar e-mail de redefinição de senha');
  }
}

/**
 * Envia um e-mail para o usuário informando que a coleta foi aceita.
 */
async function sendRequestAcceptedEmail(email, collectorName, requestDetails) {
  const htmlContent = renderTemplate('requestAccepted', {
    collectorName,
    description: requestDetails.description,
    quantity: requestDetails.quantity,
    address: requestDetails.address,
    complemento: requestDetails.complemento ? `<li><strong>Complemento:</strong> ${requestDetails.complemento}</li>` : '',
    date: requestDetails.date,
  });

  const mailOptions = {
    from: '"Recikla Maricá" <reciklamarica@gmail.com>',
    to: email,
    subject: 'Sua solicitação de coleta foi aceita - Recikla Maricá',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de aceitação enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error.message);
    throw new Error('Falha ao enviar e-mail de aceitação');
  }
}

module.exports = {
  sendResetPasswordEmail,
  sendRequestAcceptedEmail,
};
