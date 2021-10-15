const router = require('express').Router();
const ProjectGroup = require('../models/projectGroup');


router.get('/especialidades/programacion', (req, res) => {
    res.render('institucional/especialidades/computacion');
});

router.get('/especialidades/administracion-gestion', (req, res) => {
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

router.get('/equipod', (req, res) => {
    res.render('institucional/equipod');
});

router.get('/idiomas', (req, res) => {
    res.render('institucional/idiomas');
});


module.exports = router;