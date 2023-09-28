require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/moviesexplorerdb' } = process.env;

const app = express();

app.use(cors({
  origin: [
    'https://movies.explorer.nomoredomainsrocks.ru',
    'http://api.movies.explorer.nomoredomainsrocks.ru',
    'https://localhost:3000',
  ],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(helmet()); // Заголовки безопасности можно проставлять автоматически

const limiter = rateLimit({ // ограничивает количество запросов с одного IP-адреса в единицу времени
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик
app.use(errorHandler);

app.listen(PORT);
