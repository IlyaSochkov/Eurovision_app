const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Регистрация
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email уже занят' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      role: 'user',
      is_blocked: false,
    });

    const token = signToken(user);
    // user.toJSON() автоматически скроет password_hash благодаря defaultScope
    res.status(201).json({ token, user });
  } catch (e) {
    next(e);
  }
});

// Логин
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' });

    // withPassword — чтобы defaultScope не вырезал password_hash
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });
    if (user.is_blocked) return res.status(403).json({ error: 'Аккаунт заблокирован' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' });

    const token = signToken(user);
    const safeUser = { ...user.toJSON() };
    delete safeUser.password_hash;
    res.json({ token, user: safeUser });
  } catch (e) {
    next(e);
  }
});

// Профиль текущего пользователя
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Редактирование своего профиля
router.put('/me', auth, async (req, res, next) => {
  try {
    const { first_name, last_name, password } = req.body;
    const updates = {};
    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;
    if (password) updates.password_hash = await bcrypt.hash(password, 10);

    await req.user.update(updates);
    res.json(req.user);
  } catch (e) {
    next(e);
  }
});

// Удаление своего профиля
router.delete('/me', auth, async (req, res, next) => {
  try {
    await req.user.destroy();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;