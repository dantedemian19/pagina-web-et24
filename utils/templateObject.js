const jade = require('jade');

module.exports = templates = {
  projectGroupTemplate: jade.compileFile('./views/templates/projectgroup.jade', {pretty: true}),
  projectsTemplate: jade.compileFile('./views/templates/projects.jade', {pretty: true})
};
