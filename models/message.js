const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = require('./user');

var messageSchema = new Schema({
  email: {
    type: String,
    required: [true, "Debe ingresar un email."],
    match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "El email no es válido."],
    validate: {
      validator: async function(verifyEmail){
        return !(await User.findOne({email: verifyEmail}));
      },
      message: "El email ya esta en uso."
    }
  },
  subject: {
    type: String,
    required: [true, "Debe definir el asunto."]
  },
  content: {
    type: String,
    required: [true, "Debe definir el asunto."],
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Respuesta"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Usuario"
  },
  date: {
    type: Date,
    default: new Date(),
  }
});


//crea el modelo para poder insertar "Registros" sigueindo el esquema de usuario
const Message = mongoose.model('Mensaje', messageSchema);

module.exports = Message;
