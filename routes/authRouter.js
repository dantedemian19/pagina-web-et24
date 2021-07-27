const router = require('express').Router();
const passport = require('passport');

const User = require('../models/user');


router.get('/login', checkNotAuthenticated,(req, res) => {
  res.render('login');
});

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('login');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true
}), (req, res) => {
  if(req.session.redirectTo){
    return res.redirect(req.session.redirectTo);
  }
  res.redirect('/');
});

router.post('/register', checkNotAuthenticated, async(req, res) => {
  const {name, email, password, password_confirmation} = req.body;
  const user = new User({
    name,
    email,
    password,
    password_confirmation
  });
  try {
    const savedUser = await user.save();
    req.flash('success_msg', 'Ya estas registrado, puedes iniciar sesión.')
    req.flash('userEmail', email)
    req.flash('userPass', password)
    res.redirect('/users/login');
  } catch (err) {
    var err_info = {};
    for (var attribute in err.errors) {
      if (err.errors.hasOwnProperty(attribute)) {
        err_info[attribute] = err.errors[attribute].properties['message'];
      }
    }
    const err_messages = {
      err_info,
      name,
      email,
      password,
      password_confirmation
    }
    res.render('login', {err_messages});
  }
});

router.delete('/logout', (req, res) => {
  req.session.redirectTo = undefined;
  req.logOut();
  res.redirect('/');
})

router.use('/gestion', checkAuthenticated, checkPermissions);
router.use('/gestion/mensajes', require('./management/msgMngRouter'));
router.use('/gestion/usuarios',  require('./management/userMngRouter'));
router.use('/gestion/proyectos', require('./management/prjsMngRouter'));

router.get('/gestion', (req, res) => {
  res.render('gestion-vistas');
});

router.get('/perfil', checkAuthenticated, (req, res) =>{
  res.render('profile');
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.session.redirectTo = req.originalUrl;
  res.redirect('/users/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
function checkPermissions(req, res, next) {
  if(req.user.hasAdministratorPermissions){
    return next();
  }
  res.redirect('/');
}


module.exports = router;
