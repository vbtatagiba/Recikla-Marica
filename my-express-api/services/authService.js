const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { sendResetPasswordEmail } = require('../utils/email');

class AuthService {
  async register({
      username,
      email,
      password,
      role,
      cep,
      estado,
      cidade,
      rua,
      numero,
      complemento,
      bairro
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = '../uploads/padrao.png';
    const user = await userRepository.createUser({
      username,
      email,
      password: hashedPassword,
      role,
      profileImage,
      cep,
      estado,
      cidade,
      rua,
      numero,
      complemento,
      bairro
    });
    return user;
  }

  async login({ email, password }) {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    // console.log("Criando token com:", { user_id: user.id, role: user.role });

    return { user, token };
  }

  async forgotPassword(email) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    await userRepository.updateUser(user.id, {
      resetToken,
      resetTokenExpiry: Date.now() + 15 * 60 * 1000,
    });

    await sendResetPasswordEmail(email, resetToken);
  }

  async resetPassword(token, newPassword) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findUserById(decoded.id);

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }

  async getUserProfile(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    };
  }

  async updateUserProfile(userId, updateData) {
    const user = await userRepository.findUserById(userId);
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    // Atualiza os campos enviados, mas mantém os existentes caso não sejam fornecidos
    const fieldsToUpdate = {
      username: updateData.username || user.username,
      email: updateData.email || user.email,
    };
  
    // Atualiza senha, se fornecida
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      fieldsToUpdate.password = hashedPassword;
    }
  
    // Atualiza a imagem de perfil, se fornecida
    if (updateData.profileImage) {
      fieldsToUpdate.profileImage = updateData.profileImage;
    }
  
    const [rowsUpdated] = await userRepository.updateUser(user.id, fieldsToUpdate);
  
    if (rowsUpdated === 0) {
      throw new Error('Nenhuma linha foi atualizada. Verifique os dados.');
    }
  
    return { ...user.dataValues, ...fieldsToUpdate }; // Retorna os dados atualizados
  }
}

module.exports = new AuthService();
