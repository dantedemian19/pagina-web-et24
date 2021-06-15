const mongoose = require('mongoose');
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

var Schema = mongoose.Schema;

var projectSchema = new Schema({
  title: {
    type: String,
    required: [true, "Debe definir el titulo."],
  },
  markdown: {
    type: String,
    required: [true, "Debe ingresar el contenido"]
  },
  html: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
  },
  lastUpdate: {
    type: Date,
    default: new Date(),
  }
});


projectSchema.pre('validate', function(next) {
  if (this.markdown) {
    this.html = dompurify.sanitize(marked(this.markdown))
  }

  next()
})

//crea el modelo para poder insertar "Registros" sigueindo el esquema de usuario
const Project = mongoose.model('Proyecto', projectSchema);

module.exports = Project;
