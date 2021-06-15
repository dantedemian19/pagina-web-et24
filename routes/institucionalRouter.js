const router = require('express').Router();
const ProjectGroup = require('../models/projectGroup');


router.get('/especialidades/computacion',(req, res) => {
  res.render('institucional/especialidades/computacion');
});
router.get('/especialidades/ade',(req, res) => {
  res.render('institucional/especialidades/ADE');
});
router.get('/proyectos-escolares', (req, res) => {
  ProjectGroup.find().populate('associatedProjects').exec((err, groups) => {
    if(err) return res.redirect('/');
    res.render('institucional/proy', {groups});
  });
});
router.get('/equipo-docente',(req, res) => {
  res.render('institucional/equipod');
});
router.get('/regimen-evaluacion',(req, res) => {
  res.render('institucional/reg');
});
router.get('/bi',(req, res) => {
  res.render('institucional/bi');
});

module.exports = router;
