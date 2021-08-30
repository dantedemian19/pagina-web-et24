const router = require('express').Router();

const ProjectGroup = require('../../models/projectGroup');
const Project = require('../../models/project');
const templates = require('../../utils/templateObject');

router.get('/', (req, res) => {
  ProjectGroup.find((err, projectGroups) => {
    if(err) return res.redirect('/users/gestion');
    res.render('gestion/projects', {projectGroups});
  });
});

router.post('/ngroup', async (req, res) => {
  let {title} = req.body;

  const projectGroup = new ProjectGroup({groupTitle: title});
  try {
    let project = await projectGroup.save();
    let projectGroupHtml = templates.projectGroupTemplate({project});
    res.status(200).send(projectGroupHtml);
  } catch (e) {
    console.log(e);
    res.status(400).send('Hubo un problema, intentelo de nuevo');
  }
});

router.delete('/grupo/:groupId', (req, res) => {
  ProjectGroup.findOneAndRemove({_id: req.params.groupId}, async function(err, group){
    if(err) return res.redirect('/users/gestion/proyectos');
    try {
      await Project.deleteMany({_id: {$in: group.associatedProjects}});
      res.status(200).send("Se elimino correctamente.");
    } catch (e) {
      console.log(e);
      res.redirect('/users/gestion/proyectos');
    }
  });
});

router.put('/grupo/:groupId', async (req, res) => {
  const {groupTitle} = req.body;
  try {
    await ProjectGroup.findOneAndUpdate({_id: req.params.groupId}, {groupTitle});
    res.status(200).send("Se actualizo correctamente.")
  } catch (e) {
    console.log(e);
    res.redirect('/users/gestion/proyectos');
  }
});

router.get('/grupo/:groupId', (req, res) => {
  ProjectGroup.findById(req.params.groupId).populate('associatedProjects').exec((err, group) => {
    if (err) return res.redirect('/users/gestion/proyectos');
    // console.log(group);
    const projectsHtml = templates.projectsTemplate({associatedProjects: group.associatedProjects});
    res.status(200).send({group, projectsHtml});
  });
});

router.post('/grupo/:groupId/nproject', async (req, res) => {
  const {title} = req.body;
  const newProjet = new Project({title});

  ProjectGroup.findById(req.params.groupId).populate('associatedProjects').exec(async(err, group) => {
    if (err) return res.redirect('/users/gestion/proyectos');
    // console.log(group);
    try {

      const savedProject = await newProjet.save({validateBeforeSave: false});

      group.associatedProjects.push(savedProject);

      const projectsHtml = templates.projectsTemplate({associatedProjects: group.associatedProjects});
      group.save();
      res.status(200).send({group, projectsHtml});
    } catch (e) {
      console.log(e);
      return res.redirect('/users/gestion/proyectos');
    }
  });
});

router.get('/:projectId', (req, res) => {
  Project.findById(req.params.projectId).exec((err, project) => {
    if(err) return res.redirect('/users/gestion/proyectos');
    res.render('gestion/projectView', {project});
  });
});

router.put('/:projectId', async (req, res) => {
  const {title, markdown} = req.body;
  const lastUpdate = new Date();
  Project.findById(req.params.projectId).exec(async(err, project) => {
    if(err) return res.redirect(`/users/gestion/proyectos/${req.params.projectId}`);
    project.title = title;
    project.markdown = markdown;
    project.lastUpdate = lastUpdate;
    try {
      await project.save();
      res.redirect(`/users/gestion/proyectos/${req.params.projectId}`);
    } catch (e) {
      console.log(e);
      res.redirect(`/users/gestion/proyectos/${req.params.projectId}`);
    }
  });
});

router.delete('/:groupId/:projectId', async(req, res) => {
  ProjectGroup.findById(req.params.groupId).populate('associatedProjects').exec(async(err, group) => {
    if (err) return res.redirect('/users/gestion/proyectos');
    try {
      await Project.findOneAndRemove({_id: req.params.projectId});

      const projectIndex = group.associatedProjects.map((project) => project._id).indexOf(req.params.projectId);
      group.associatedProjects.splice(projectIndex, 1);
      const projectsHtml = templates.projectsTemplate({associatedProjects: group.associatedProjects});

      await group.save();
      res.status(200).send({group, projectsHtml});
    } catch (e) {
      console.log(e);
      res.redirect('/users/gestion/proyectos');
    }
  });
});

module.exports = router;
