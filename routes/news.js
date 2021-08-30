const router = require('express').Router();
const NewsSchema = require('../models/news')

// List of news
router.get('/', async (req, res) => {
    const allNews = await NewsSchema.find()
    res.render('news/all', { allNews });
});

// Single new
router.get('/:id', async (req, res) => {
    const singleNew = await NewsSchema.findOne({_id: req.params.id})
    res.render('news/single', { singleNew });
});

module.exports = router;