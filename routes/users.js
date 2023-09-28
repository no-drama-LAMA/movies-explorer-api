const router = require('express').Router();
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validations');

router.get('/me', getCurrentUser); // возвращает информацию о текущем пользователе

router.patch('/me', updateUserValidation, updateUser); // обновляет профиль

module.exports = router;
