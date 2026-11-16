const express = require('express');
const { Genre } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await Genre.findAll({ order: [['title', 'ASC']] }));
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Жанр не найден' });
    res.json(genre);
  } catch (e) { next(e); }
});

router.post('/', auth, admin, async (req, res, next) => {
  try {
    const genre = await Genre.create({ title: req.body.title });
    res.status(201).json(genre);
  } catch (e) { next(e); }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Жанр не найден' });
    await genre.update(req.body);
    res.json(genre);
  } catch (e) { next(e); }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Жанр не найден' });
    await genre.destroy();
    res.status(204).end();
  } catch (e) {
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Нельзя удалить жанр: есть связанные песни' });
    }
    next(e);
  }
});

module.exports = router;