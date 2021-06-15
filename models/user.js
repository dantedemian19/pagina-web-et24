const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:{
    type: String,
    required: [true, "Debe ingresar un nombre."],
    maxlength:[60, "El nombre de usuario no puede exceder los 60 caracteres."],
    minlength:[7, "El nombre debe contener al menos 7 caracteres."]
  },
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
  password: {
    type: String,
    required: [true, "Debe ingresar una contraseña."],
    minlength: [8, "La contraseña debe contener al menos 8 caracteres."],
    validate: {
      validator: async function(p){
        if (this.password_confirmation == p) {
          this.password = await bcrypt.hash(this.password, 10)
          return true;
        }
        return false;
      },
      message: "Las contraseñas no son iguales."
    }
  },
  hasAdministratorPermissions: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: new Date()
  }
});

userSchema.virtual('password_confirmation').get(function(){
  return this.p_confirm;
}).set(function(password){
  this.p_confirm = password;
});

//crea el modelo para poder insertar "Registros" siguiendo el esquema de usuario
const User = mongoose.model('Usuario', userSchema);

module.exports = User;
