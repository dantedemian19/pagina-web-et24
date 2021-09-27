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
const auth = require("./security/auth"); //jwt para encriptar

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
app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
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
