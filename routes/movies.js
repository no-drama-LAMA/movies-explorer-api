const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validations');

router.get('/', getMovies); // возвращает все фильмы

router.post('/', createMovieValidation, createMovie); // создаёт фильм

router.delete('/:movieId', deleteMovieValidation, deleteMovie); // удаляет фильм по идентификатору

module.exports = router;
