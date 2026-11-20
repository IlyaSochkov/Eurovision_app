const express = require('express');
const { User, Review, Song, Artist, Country, Genre } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Все роуты админки защищены
router.use(auth, admin);

// Пользователи
router.get('/users', async (req, res, next) => {
  try {
    res.json(await User.findAll({ order: [['id', 'ASC']] }));
  } catch (e) { next(e); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(user);
  } catch (e) { next(e); }
});

// Изменение роли / блокировка
router.put('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    const { role, is_blocked, first_name, last_name } = req.body;

    if (user.role === 'admin' && typeof is_blocked === 'boolean' && is_blocked) {
      return res.status(403).json({ error: 'Нельзя заблокировать другого администратора' });
    }
    
    const updates = {};
    if (role) updates.role = role;
    if (typeof is_blocked === 'boolean') updates.is_blocked = is_blocked;
    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;

    await user.update(updates);
    res.json(user);
  } catch (e) { next(e); }
});

// Модерация отзывов: все отзывы
router.get('/reviews', async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'first_name'] },
        { model: Song, as: 'song', attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (e) { next(e); }
});

// Удаление некорректного отзыва (модерация)
router.delete('/reviews/:id', async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
    await review.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
