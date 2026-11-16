const { sequelize, Song, Artist, Country, Genre } = require('./models');

(async () => {
  await sequelize.authenticate();
  console.log('DB connected');

  // Проверяем, есть ли данные; если нет — создаём минимальный набор
  let country = await Country.findOne({ where: { name: 'Sweden' } });
  if (!country) {
    country = await Country.create({
      name: 'Sweden',
      flag_url: 'https://flagcdn.com/se.svg',
      latitude: 60.1282,
      longitude: 18.6435,
    });
  }

  let genre = await Genre.findOne({ where: { title: 'Pop' } });
  if (!genre) genre = await Genre.create({ title: 'Pop' });

  let artist = await Artist.findOne({ where: { name: 'Loreen' } });
  if (!artist) {
    artist = await Artist.create({
      name: 'Loreen',
      bio: 'Swedish singer, winner of Eurovision 2012 and 2023',
      country_id: country.id,
    });
  }

  let song = await Song.findOne({ where: { title: 'Tattoo' } });
  if (!song) {
    song = await Song.create({
      title: 'Tattoo',
      artist_id: artist.id,
      country_id: country.id,
      genre_id: genre.id,
      year: 2023,
      audio_url: '/uploads/tattoo.mp3',
      video_url: 'https://www.youtube.com/watch?v=BE2Fj0W4jP4&list=RDBE2Fj0W4jP4',
      lyrics: 'I don\'t wanna go, but I gotta go...',
    });
  }

  const songs = await Song.findAll({
    limit: 3,
    include: [
      { model: Artist, as: 'artist' },
      { model: Country, as: 'country' },
      { model: Genre, as: 'genre' },
    ],
  });

  console.log(JSON.stringify(songs, null, 2));
  await sequelize.close();
})();