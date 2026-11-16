const express = require('express');
const { Playlist, Song, Artist, Country, Genre } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Все плейлисты текущего пользователя
router.get('/', auth, async (req, res, next) => {
  try {
    const playlists = await Playlist.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Song, as: 'songs' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(playlists);
  } catch (e) { next(e); }
});

// Содержимое конкретного плейлиста (только своего)
router.get('/:id', auth, async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: Song,
        as: 'songs',
        include: [
          { model: Artist, as: 'artist' },
          { model: Country, as: 'country' },
          { model: Genre, as: 'genre' },
        ],
      }],
    });
    if (!playlist) return res.status(404).json({ error: 'Плейлист не найден' });
    res.json(playlist);
  } catch (e) { next(e); }
});

// Создать плейлист
router.post('/', auth, async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Укажите название' });
    const playlist = await Playlist.create({ user_id: req.user.id, title });
    res.status(201).json(playlist);
  } catch (e) { next(e); }
});

// Переименовать
router.put('/:id', auth, async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!playlist) return res.status(404).json({ error: 'Плейлист не найден' });
    await playlist.update({ title: req.body.title });
    res.json(playlist);
  } catch (e) { next(e); }
});

// Удалить
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!playlist) return res.status(404).json({ error: 'Плейлист не найден' });
    await playlist.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
});

// Добавить песню в плейлист
router.post('/:id/songs', auth, async (req, res, next) => {
  try {
    const { song_id } = req.body;
    const playlist = await Playlist.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!playlist) return res.status(404).json({ error: 'Плейлист не найден' });

    const song = await Song.findByPk(song_id);
    if (!song) return res.status(404).json({ error: 'Песня не найдена' });

    await playlist.addSong(song);
    res.status(201).json({ message: 'Песня добавлена' });
  } catch (e) { next(e); }
});

// Удалить песню из плейлиста
router.delete('/:id/songs/:songId', auth, async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!playlist) return res.status(404).json({ error: 'Плейлист не найден' });
    await playlist.removeSong(req.params.songId);
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;