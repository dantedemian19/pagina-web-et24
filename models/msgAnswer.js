const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  // email: {
  //   type: String,
  //   required: [true, "Debe ingresar un email."],
  //   match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "El email no es válido."]
  // },
  content: {
    type: String,
    required: [true, "Debe definir el asunto."],
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


//crea el modelo para poder insertar "Registros" siguiendo el esquema de usuario
const Answer = mongoose.model('Respuesta', answerSchema);

module.exports = Answer;
