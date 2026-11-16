const express = require('express');
const { Artist, Country, Song } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Публичный список с вложенной страной
router.get('/', async (req, res, next) => {
  try {
    const artists = await Artist.findAll({
      include: [{ model: Country, as: 'country' }],
      order: [['name', 'ASC']],
    });
    res.json(artists);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      include: [
        { model: Country, as: 'country' },
        { model: Song, as: 'songs' },
      ],
    });
    if (!artist) return res.status(404).json({ error: 'Исполнитель не найден' });
    res.json(artist);
  } catch (e) { next(e); }
});

router.post('/', auth, admin, async (req, res, next) => {
  try {
    const { name, bio, country_id } = req.body;
    const artist = await Artist.create({ name, bio, country_id });
    res.status(201).json(artist);
  } catch (e) { next(e); }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Исполнитель не найден' });
    await artist.update(req.body);
    res.json(artist);
  } catch (e) { next(e); }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Исполнитель не найден' });
    await artist.destroy();
    res.status(204).end();
  } catch (e) {
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Нельзя удалить исполнителя: есть связанные песни' });
    }
    next(e);
  }
});

module.exports = router;