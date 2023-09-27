const mongoose = require("mongoose");
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  director: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  duration: {
    type: Number, // это число
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  year: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  description: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  image: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'URL указан неправильно',
    },
  },
  trailerLink: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'URL указан неправильно',
    },
  },
  thumbnail: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'URL указан неправильно',
    },
  },
  owner: { // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId, // тип ObjectId
    required: true, // обязательное поле
    ref: 'user',
  },
  movieId: {
    type: Number, // это число
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  nameRU: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
  nameEN: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
