const express = require('express');
const { Review, Song, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Отзывы о конкретной песне (публично)
router.get('/song/:songId', async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { song_id: req.params.songId },
      include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (e) { next(e); }
});

// Добавить отзыв
router.post('/', auth, async (req, res, next) => {
  try {
    const { song_id, rating, comment } = req.body;
    if (!song_id || !rating) return res.status(400).json({ error: 'song_id и rating обязательны' });

    const song = await Song.findByPk(song_id);
    if (!song) return res.status(404).json({ error: 'Песня не найдена' });

    const existing = await Review.findOne({ where: { user_id: req.user.id, song_id } });
    if (existing) return res.status(409).json({ error: 'Вы уже оставили отзыв на эту песню' });

    const review = await Review.create({
      user_id: req.user.id,
      song_id,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (e) { next(e); }
});

// Редактировать свой отзыв
router.put('/:id', auth, async (req, res, next) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
    await review.update({ rating: req.body.rating, comment: req.body.comment });
    res.json(review);
  } catch (e) { next(e); }
});

// Удалить свой отзыв
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
    await review.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;