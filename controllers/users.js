const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const User = require('../models/user');
const ConflictError = require('../errors/Conflict');

const { SECRET_KEY = 'movies-explorer-key' } = process.env;

// возвращает информацию о пользователе (email и имя)
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// обновляет информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => { // создать пользователя
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(201).send({
      name: user.name, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};
