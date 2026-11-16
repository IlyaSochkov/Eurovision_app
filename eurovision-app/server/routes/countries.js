const express = require('express');
const { Country, Artist, Song } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Публичный список
router.get('/', async (req, res, next) => {
  try {
    const countries = await Country.findAll({ order: [['name', 'ASC']] });
    res.json(countries);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ error: 'Страна не найдена' });
    res.json(country);
  } catch (e) { next(e); }
});

// Только админ
router.post('/', auth, admin, async (req, res, next) => {
  try {
    const { name, flag_url} = req.body;
    const country = await Country.create({ name, flag_url });
    res.status(201).json(country);
  } catch (e) { next(e); }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ error: 'Страна не найдена' });
    await country.update(req.body);
    res.json(country);
  } catch (e) { next(e); }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ error: 'Страна не найдена' });
    await country.destroy();
    res.status(204).end();
  } catch (e) {
    // FK RESTRICT не даст удалить страну, если есть артисты/песни
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Нельзя удалить страну: есть связанные артисты или песни' });
    }
    next(e);
  }
});

module.exports = router;