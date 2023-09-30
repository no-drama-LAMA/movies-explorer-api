const router = require('express').Router();
const { login } = require('../controllers/users');
const { loginValidation } = require('../middlewares/validations');

router.post('/', loginValidation, login);

module.exports = router;
