const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { sendResetPasswordEmail } = require('../utils/email');

class AuthService {
  async register({ username, email, password, role}) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({ username, email, password: hashedPassword, role });
    return user;
  }

  async login({ email, password }) {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  }

  async forgotPassword(email) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');
  
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    await userRepository.updateUser(user.id, { resetToken, resetTokenExpiry: Date.now() + 15 * 60 * 1000 });
  
    await sendResetPasswordEmail(email, resetToken);
  }

  async resetPassword(token, newPassword) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findUserById(decoded.id);

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUser(user.id, { password: hashedPassword, resetToken: null, resetTokenExpiry: null });
  }
}

module.exports = new AuthService();
