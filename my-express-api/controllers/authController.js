const authService = require('../services/authService');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({ message: 'Link de redefinição de senha enviado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.query.token; // Token vindo da query string
    const newPassword = req.body.password; // Nome correto da chave para a nova senha

    // Chama o serviço de redefinição de senha
    await authService.resetPassword(token, newPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      throw new Error('Usuário não autenticado ou ID ausente.');
    }

    const userId = req.user.user_id;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage ? `/uploads/${user.profileImage}` : null,
    });
  } catch (error) {
    console.error('Erro ao obter o perfil:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // ID do usuário autenticado
    const updatedData = { ...req.body };

    // Verifique se o arquivo foi enviado pelo multer
    if (req.file) {
      console.log('Arquivo recebido pelo multer:', req.file);
      updatedData.profileImage = `/uploads/${req.file.filename}`; // Caminho do arquivo salvo
    }

    // console.log('Dados recebidos no updateProfile:', updatedData);

    const updatedUser = await authService.updateUserProfile(userId, updatedData);

    if (!updatedUser) {
      throw new Error('Nenhuma linha foi atualizada. Verifique os dados.');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error.message);
    res.status(400).json({ error: error.message });
  }
};
