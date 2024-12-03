const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.user_id) {
      throw new Error("Token inválido: campo 'user_id' ausente.");
    }

    req.user = decoded;
    next(); // Passa para o próximo middleware ou controlador
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado',
      redirectTo: '/'
    });
  }
};
