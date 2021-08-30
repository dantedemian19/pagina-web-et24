const router = require('express').Router();
const ProjectGroup = require('../models/projectGroup');


router.get('/especialidades/computacion', (req, res) => {
  res.render('institucional/especialidades/computacion');
});

router.get('/especialidades/ade', (req, res) => {
  res.render('institucional/especialidades/ADE');
});

// router.get('/proyesc', (req, res) => {
//   ProjectGroup.find().populate('associatedProjects').exec((err, groups) => {
//     if(err) return res.redirect('/');
//     res.render('/institucional/proyesc', {groups});
//   });
// });

router.get('/regimen-evaluacion', (req, res) => {
  res.render('institucional/reg');
});

router.get('/proyextra', (req, res) => {
  res.render('institucional/proyextra');
});

router.get('/proyextra/ted', (req, res) => {
  res.render('institucional/extracurriculares/ted');
});

router.get('/proyextra/onu', (req, res) => {
  res.render('institucional/extracurriculares/onu');
});

router.get('/proyextra/radio', (req, res) => {
  res.render('institucional/extracurriculares/radio');
});

router.get('/proyextra/miFactura', (req, res) => {
  res.render('institucional/extracurriculares/miFactura');
});

router.get('/equipod', (req, res) => {
  res.render('institucional/equipod');
});

router.get('/proyesc', (req, res) => {
  res.render('institucional/proyesc');
});

router.get('/bi', (req, res) => {
  res.render('institucional/bi');
});


module.exports = router;
