const router = require('express').Router();

const moviesRouter = require('./movies');
const usersRouter = require('./users');
const signupRouter = require('./signup');
const signinRouter = require('./signin');

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFound');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);
router.use(auth);
router.use('/movies', moviesRouter);
router.use('/users', usersRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

module.exports = router;
