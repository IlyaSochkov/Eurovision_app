const express = require('express');
const { Op } = require('sequelize');
const { Song, Artist, Country, Genre, Review, User } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../utils/upload');

const router = express.Router();

// Публичный каталог с фильтрами: ?year=2023&country_id=1&genre_id=2&search=tattoo
router.get('/', async (req, res, next) => {
  try {
    const { year, country_id, genre_id, search } = req.query;
    const where = {};
    if (year) where.year = Number(year);
    if (country_id) where.country_id = Number(country_id);
    if (genre_id) where.genre_id = Number(genre_id);
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const songs = await Song.findAll({
      where,
      include: [
        { model: Artist, as: 'artist' },
        { model: Country, as: 'country' },
        { model: Genre, as: 'genre' },
      ],
      order: [['year', 'DESC'], ['title', 'ASC']],
    });
    res.json(songs);
  } catch (e) { next(e); }
});

router.post('/upload-audio', auth, admin, upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не получен' });
  }
  res.json({ audio_url: `/uploads/${req.file.filename}` });
});

// Детальная страница песни с отзывами и авторами отзывов
router.get('/:id', async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id, {
      include: [
        { model: Artist, as: 'artist' },
        { model: Country, as: 'country' },
        { model: Genre, as: 'genre' },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name'] }],
        },
      ],
    });
    if (!song) return res.status(404).json({ error: 'Песня не найдена' });
    res.json(song);
  } catch (e) { next(e); }
});

// Создание песни (админ)
router.post('/', auth, admin, async (req, res, next) => {
  try {
    const { title, artist_id, country_id, genre_id, year, audio_url, video_url, lyrics } = req.body;
    const song = await Song.create({
      title, artist_id, country_id, genre_id, year, audio_url, video_url, lyrics,
    });
    res.status(201).json(song);
  } catch (e) { next(e); }
});

// Редактирование песни (админ)
router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Песня не найдена' });
    await song.update(req.body);
    res.json(song);
  } catch (e) { next(e); }
});

// Удаление песни (админ)
router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Песня не найдена' });
    await song.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;