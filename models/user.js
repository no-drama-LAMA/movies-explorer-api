const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Адрес электронной почты указан неправильно',
    },
  },
  password: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    select: false,
  },
  name: {
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    minlength: [2, 'Текст должен быть не короче 2 симв.'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Текст должен быть не длиннее 30 симв.'], // а максимальная — 30 символов
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
