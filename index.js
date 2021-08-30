if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//importa las paquetes necesarios
const express          = require('express'); // manejo de rutas
const mongoose         = require('mongoose'); // conexion con la BD
const methodOverride   = require('method-override'); // enviar peticiones distintas de GET y POST
const bcrypt           = require('bcrypt'); // encriptar (contraseñas)
const cookieParser     = require('cookie-parser'); // analiza las cookies
const session          = require('express-session'); // guarda la sesion
const flash            = require('express-flash') // enviar mensajes en redirects
const passport         = require('passport'); // autenticacion de sesion
const morgan           = require('morgan');
const addLocalStrategy = require('./localPassport-config') // estrategia de autenticacion

const app = express();

const PORT = process.env.PORT || 8080;

// conecta con la base de datos
mongoose.connect('mongodb://localhost/ET24', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        .then(() => console.log('Conectado con MongoDB.'))
        .catch(err => console.log(err));


// define a jade como motor de vistas
app.set('view engine', 'jade');

// sirve la carpeta public con los archivos publicos
app.use('/public', express.static('public'));

// Debug del back
app.use(morgan("dev"));

// premite extraer los datos del cuerpo de las solicitudes
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// define la estrategia local para la autenticación de la sesion
addLocalStrategy(passport)
app.use(passport.initialize());
app.use(passport.session());

// añade informacion util al objeto res.locals
app.use((req, res, next) => {
  if(req.isAuthenticated()){
    res.locals = {
      user: {
        _id: req.user._id,
        hasAdministratorPermissions: req.user.hasAdministratorPermissions,
        name: req.user.name,
      }
    }
  }
  next();
});

//monta el router con  el direccionamiento para las rutas de institucional
app.use('/institucional', require('./routes/institucionalRouter'));
//monta el router con  el direccionamiento para las rutas de sesion
app.use('/users', require('./routes/authRouter'))
app.use('/messages', require('./routes/messagesRouter'));
app.use('/news', require('./routes/news'));


// Direccionamiento basico
app.get('/',(req, res) => {
  res.render('inicio');
});

//404 not found page
app.use((req, res, next) => {
  res.status(404).render('error');
});

app.listen(PORT, () => {
  console.log("server escuchando en el puerto *", PORT);
});
