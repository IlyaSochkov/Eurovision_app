'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ---------- Страны (8 штук) ----------
    const countriesData = [
      { name: 'Russia', flag_url: 'https://flagcdn.com/ru.svg' },
      { name: 'Belarus', flag_url: 'https://flagcdn.com/by.svg' },
      { name: 'San Marino', flag_url: 'https://flagcdn.com/sm.svg' },
      { name: 'Sweden', flag_url: 'https://flagcdn.com/se.svg' },
      { name: 'Italy', flag_url: 'https://flagcdn.com/it.svg' },
      { name: 'Ukraine', flag_url: 'https://flagcdn.com/ua.svg' },
      { name: 'Norway', flag_url: 'https://flagcdn.com/no.svg' },
      { name: 'Austria', flag_url: 'https://flagcdn.com/at.svg' },
    ];

    const countryMap = {};
    for (const c of countriesData) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id FROM "Countries" WHERE name = :name LIMIT 1`,
        { replacements: { name: c.name }, type: Sequelize.QueryTypes.SELECT }
      );
      if (existing) {
        countryMap[c.name] = existing.id;
      } else {
        await queryInterface.bulkInsert('Countries', [{ ...c, createdAt: now, updatedAt: now }]);
        const [row] = await queryInterface.sequelize.query(
          `SELECT id FROM "Countries" WHERE name = :name LIMIT 1`,
          { replacements: { name: c.name }, type: Sequelize.QueryTypes.SELECT }
        );
        countryMap[c.name] = row.id;
      }
    }

    // ---------- Жанры ----------
    const genresData = ['Pop', 'Ballad', 'Rock', 'Dance', 'Folk'];
    const genreMap = {};
    for (const title of genresData) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id FROM "Genres" WHERE title = :title LIMIT 1`,
        { replacements: { title }, type: Sequelize.QueryTypes.SELECT }
      );
      if (existing) {
        genreMap[title] = existing.id;
      } else {
        await queryInterface.bulkInsert('Genres', [{ title, createdAt: now, updatedAt: now }]);
        const [row] = await queryInterface.sequelize.query(
          `SELECT id FROM "Genres" WHERE title = :title LIMIT 1`,
          { replacements: { title }, type: Sequelize.QueryTypes.SELECT }
        );
        genreMap[title] = row.id;
      }
    }

    // ---------- Исполнители (по 5 от каждой страны) ----------
    // [name, countryName, bio]
    const artistsData = [
      // Россия (5)
      ['Dima Bilan', 'Russia', 'Российский певец, победитель Евровидения-2008 с песней Believe [citation:1][citation:8].'],
      ['Buranovskiye Babushki', 'Russia', 'Удмуртский фольклорный коллектив, второе место в 2012 году [citation:5].'],
      ['Polina Gagarina', 'Russia', 'Российская певица, второе место на Евровидении-2015 [citation:15].'],
      ['Sergey Lazarev', 'Russia', 'Российский певец, участник 2016 и 2019 годов, оба раза топ-3 [citation:12].'],
      ['Manizha', 'Russia', 'Российская певица, участница 2021 года.'],

      // Беларусь (5)
      ['Dmitry Koldun', 'Belarus', 'Белорусский певец, финалист Евровидения-2007 (6 место) [citation:2][citation:6].'],
      ['Alyona Lanskaya', 'Belarus', 'Белорусская певица, участница финала 2013 года [citation:2].'],
      ['Teo (Yuri Vashchuk)', 'Belarus', 'Белорусский певец, участник финала 2014 года [citation:2].'],
      ['NAVIBAND', 'Belarus', 'Белорусская фолк-группа, финалисты 2017 года [citation:2][citation:9].'],
      ['ALEKSEEV', 'Belarus', 'Белорусский певец, участник 2018 года [citation:2].'],

      // Сан-Марино (5, обязательно Валентина Монетта)
      ['Valentina Monetta', 'San Marino', 'Сан-маринская джазовая и поп-певица, четырёхкратная представительница Сан-Марино (2012, 2013, 2014, 2017). Первая финалистка от Сан-Марино (2014).'],
      ['Miodio', 'San Marino', 'Сан-маринская группа, первый представитель страны на Евровидении (2008).'],
      ['Senhit', 'San Marino', 'Итальянская певица эритрейского происхождения. Представляла Сан-Марино в 2011 («Stand By»), 2021 («Adrenalina» с Flo Rida) и 2026 («Superstar»). В 2020 году была выбрана, но конкурс отменили из-за COVID-19.'],
      ['Achille Lauro', 'San Marino', 'Итальянский певец и рэпер, представитель Сан-Марино в 2022 году.'],
      ['Piqued Jacks', 'San Marino', 'Итальянская рок-группа, представитель Сан-Марино в 2023 году.'],

      // Швеция (5)
      ['Loreen', 'Sweden', 'Шведская певица, двукратная победительница Евровидения (2012, 2023) [citation:4].'],
      ['Måns Zelmerlöw', 'Sweden', 'Шведский певец, победитель Евровидения-2015 [citation:4].'],
      ['ABBA', 'Sweden', 'Шведская группа, победитель Евровидения-1974 с песней Waterloo [citation:4].'],
      ['Charlotte Nilsson', 'Sweden', 'Шведская певица, победительница Евровидения-1999 [citation:4].'],
      ['Carola', 'Sweden', 'Шведская певица, победительница Евровидения-1991 [citation:4].'],

      // Италия (5)
      ['Måneskin', 'Italy', 'Итальянская рок-группа, победитель Евровидения-2021 [citation:4].'],
      ['Toto Cutugno', 'Italy', 'Итальянский певец, победитель Евровидения-1990 [citation:4].'],
      ['Domenico Modugno', 'Italy', 'Итальянский певец, участник первых конкурсов, автор Volare.'],
      ['Raphael Gualazzi', 'Italy', 'Итальянский певец, участник 2011 года.'],
      ['Mahmood', 'Italy', 'Итальянский певец, участник 2019 и 2022 годов.'],

      // Украина (5)
      ['Kalush Orchestra', 'Ukraine', 'Украинская фолк-рэп-группа, победитель Евровидения-2022 [citation:4].'],
      ['Jamala', 'Ukraine', 'Украинская певица, победительница Евровидения-2016 [citation:4].'],
      ['Ruslana', 'Ukraine', 'Украинская певица, победительница Евровидения-2004 [citation:4].'],
      ['Verka Serduchka', 'Ukraine', 'Украинский артист (Андрей Данилко), второе место в 2007 году.'],
      ['Go_A', 'Ukraine', 'Украинская фолк-электро-группа, участница 2021 года.'],

      // Норвегия (5)
      ['Alexander Rybak', 'Norway', 'Норвежский скрипач и певец, победитель Евровидения-2009 с рекордным результатом [citation:4].'],
      ['Secret Garden', 'Norway', 'Норвежско-ирландский дуэт, победитель Евровидения-1995.'],
      ['Jahn Teigen', 'Norway', 'Норвежский певец, участник нескольких конкурсов.'],
      ['Margaret Berger', 'Norway', 'Норвежская певица, участница 2013 года.'],
      ['KEiiNO', 'Norway', 'Норвежская группа, участница 2019 года.'],

      // Австрия (5)
      ['Conchita Wurst', 'Austria', 'Австрийский певец (Том Нойвирт), победитель Евровидения-2014 [citation:4].'],
      ['Udo Jürgens', 'Austria', 'Австрийский певец, победитель Евровидения-1966 [citation:4].'],
      ['JJ', 'Austria', 'Австрийский певец, победитель Евровидения-2025 с песней Wasted Love [citation:4].'],
      ['Cesár Sampson', 'Austria', 'Австрийский певец, участник 2018 года.'],
      ['Paenda', 'Austria', 'Австрийская певица, участница 2019 года.'],
    ];

    const artistMap = {};
    for (const [name, countryName, bio] of artistsData) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id FROM "Artists" WHERE name = :name LIMIT 1`,
        { replacements: { name }, type: Sequelize.QueryTypes.SELECT }
      );
      if (existing) {
        artistMap[name] = existing.id;
      } else {
        await queryInterface.bulkInsert('Artists', [{
          name,
          bio,
          country_id: countryMap[countryName],
          createdAt: now,
          updatedAt: now,
        }]);
        const [row] = await queryInterface.sequelize.query(
          `SELECT id FROM "Artists" WHERE name = :name LIMIT 1`,
          { replacements: { name }, type: Sequelize.QueryTypes.SELECT }
        );
        artistMap[name] = row.id;
      }
    }

    // ---------- Песни (по одной на исполнителя) ----------
    // [title, artistName, countryName, genreTitle, year]
    const songsData = [
      // Россия
      ['Believe', 'Dima Bilan', 'Russia', 'Pop', 2008],
      ['Party for Everybody', 'Buranovskiye Babushki', 'Russia', 'Folk', 2012],
      ['A Million Voices', 'Polina Gagarina', 'Russia', 'Ballad', 2015],
      ['You Are the Only One', 'Sergey Lazarev', 'Russia', 'Pop', 2016],
      ['Russian Woman', 'Manizha', 'Russia', 'Pop', 2021],

      // Беларусь
      ['Work Your Magic', 'Dmitry Koldun', 'Belarus', 'Pop', 2007],
      ['Solayoh', 'Alyona Lanskaya', 'Belarus', 'Pop', 2013],
      ['Cheesecake', 'Teo (Yuri Vashchuk)', 'Belarus', 'Pop', 2014],
      ['Story of My Life', 'NAVIBAND', 'Belarus', 'Folk', 2017],
      ['Forever', 'ALEKSEEV', 'Belarus', 'Pop', 2018],

      // Сан-Марино
      ['The Social Network Song', 'Valentina Monetta', 'San Marino', 'Pop', 2012],
      ['Crisalide (Vola)', 'Valentina Monetta', 'San Marino', 'Ballad', 2013],
      ['Maybe (Forse)', 'Valentina Monetta', 'San Marino', 'Ballad', 2014],
      ['Adrenalina', 'Senhit', 'San Marino', 'Pop', 2021],
      ['Complice', 'Miodio', 'San Marino', 'Rock', 2008],

      // Швеция
      ['Euphoria', 'Loreen', 'Sweden', 'Dance', 2012],
      ['Tattoo', 'Loreen', 'Sweden', 'Pop', 2023],
      ['Heroes', 'Måns Zelmerlöw', 'Sweden', 'Pop', 2015],
      ['Waterloo', 'ABBA', 'Sweden', 'Pop', 1974],
      ['Take Me to Your Heaven', 'Charlotte Nilsson', 'Sweden', 'Pop', 1999],

      // Италия
      ['Zitti e buoni', 'Måneskin', 'Italy', 'Rock', 2021],
      ['Insieme: 1992', 'Toto Cutugno', 'Italy', 'Ballad', 1990],
      ['Nel blu dipinto di blu (Volare)', 'Domenico Modugno', 'Italy', 'Ballad', 1958],
      ['Madness of Love', 'Raphael Gualazzi', 'Italy', 'Pop', 2011],
      ['Soldi', 'Mahmood', 'Italy', 'Pop', 2019],

      // Украина
      ['Stefania', 'Kalush Orchestra', 'Ukraine', 'Folk', 2022],
      ['1944', 'Jamala', 'Ukraine', 'Ballad', 2016],
      ['Wild Dances', 'Ruslana', 'Ukraine', 'Dance', 2004],
      ['Dancing Lasha Tumbai', 'Verka Serduchka', 'Ukraine', 'Dance', 2007],
      ['Shum', 'Go_A', 'Ukraine', 'Folk', 2021],

      // Норвегия
      ['Fairytale', 'Alexander Rybak', 'Norway', 'Pop', 2009],
      ['Nocturne', 'Secret Garden', 'Norway', 'Ballad', 1995],
      ['Mil etter mil', 'Jahn Teigen', 'Norway', 'Pop', 1978],
      ['I Feed You My Love', 'Margaret Berger', 'Norway', 'Pop', 2013],
      ['Spirit in the Sky', 'KEiiNO', 'Norway', 'Folk', 2019],

      // Австрия
      ['Rise Like a Phoenix', 'Conchita Wurst', 'Austria', 'Ballad', 2014],
      ['Merci, Chérie', 'Udo Jürgens', 'Austria', 'Ballad', 1966],
      ['Wasted Love', 'JJ', 'Austria', 'Pop', 2025],
      ['Nobody but You', 'Cesár Sampson', 'Austria', 'Pop', 2018],
      ['Limits', 'Paenda', 'Austria', 'Pop', 2019],
    ];

    for (const [title, artistName, countryName, genreTitle, year] of songsData) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id FROM "Songs" WHERE title = :title AND year = :year LIMIT 1`,
        { replacements: { title, year }, type: Sequelize.QueryTypes.SELECT }
      );
      if (existing) continue;

      await queryInterface.bulkInsert('Songs', [{
        title,
        artist_id: artistMap[artistName],
        country_id: countryMap[countryName],
        genre_id: genreMap[genreTitle],
        year,
        audio_url: `/uploads/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp3`,
        video_url: '',
        lyrics: '',
        createdAt: now,
        updatedAt: now,
      }]);
    }

    console.log('✅ Сиды Евровидения (8 стран × 5 представителей) загружены');
  },

  async down(queryInterface) {
    const countryNames = ['Russia', 'Belarus', 'San Marino', 'Sweden', 'Italy', 'Ukraine', 'Norway', 'Austria'];
    const genreTitles = ['Pop', 'Ballad', 'Rock', 'Dance', 'Folk'];

    await queryInterface.sequelize.query(
      `DELETE FROM "Songs" WHERE country_id IN (SELECT id FROM "Countries" WHERE name IN (:names))`,
      { replacements: { names: countryNames } }
    );
    await queryInterface.sequelize.query(
      `DELETE FROM "Artists" WHERE country_id IN (SELECT id FROM "Countries" WHERE name IN (:names))`,
      { replacements: { names: countryNames } }
    );
    await queryInterface.bulkDelete('Countries', { name: countryNames });
    await queryInterface.bulkDelete('Genres', { title: genreTitles });
  },
};