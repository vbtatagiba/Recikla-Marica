const User = require('../models/User');

class UserRepository {
  async createUser(data) {
    return User.create(data);
  }

  async findUserByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async findUserById(id) {
    return User.findByPk(id);
  }

  async updateUser(id, data) {
    return User.update(data, { where: { id } });
  }
}

module.exports = new UserRepository();
