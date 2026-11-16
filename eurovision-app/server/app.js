require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/countries', require('./routes/countries'));
app.use('/api/genres', require('./routes/genres'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Глобальный обработчик ошибок (чтобы не падало на необработанных исключениях)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Startup error:', e);
  }
})();