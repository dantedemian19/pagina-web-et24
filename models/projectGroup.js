const mongoose = require('mongoose');
const Project = require('./project');

var Schema = mongoose.Schema;

var projectGroupSchema = new Schema({
  groupTitle: {
    type: String,
    required: [true, "Debe definir el titulo."],
  },
  associatedProjects: [{
    type: Schema.Types.ObjectId,
    ref: "Proyecto"
  }],
  date: {
    type: Date,
    default: new Date(),
  }
});

// projectGroupSchema.post('remove', { query: true, document: false }, function(next){
//   console.log("Borrando proyectos asociados");
//   Project.remove({_id: {$in: this.associatedProjects}});
//   next();
// });

const ProjectGroup = mongoose.model('Grupos-Proyecto', projectGroupSchema);

module.exports = ProjectGroup;
