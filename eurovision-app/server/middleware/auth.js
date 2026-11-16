const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Требуется авторизация' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Подгружаем пользователя, чтобы проверить блокировку и актуальную роль
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: 'Пользователь не найден' });
    if (user.is_blocked) return res.status(403).json({ error: 'Аккаунт заблокирован' });

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};