const router = require('express').Router({mergeParams: true});
const NewsSchema = require('../../models/news')

router.get('/', async (req, res) => {
    const allNews = await NewsSchema.find()
    res.render('gestion/news/all', { allNews });
});

router.get('/create', async (req, res) => {
    const allNews = await NewsSchema.find()
    res.render('gestion/news/create', { allNews });
});

router.post('/', async (req, res) => {

    // Get req params
    const { title, body, extract } = req.body;
    const errors = [];

    // Validations and error msg
    if (!title) {
        errors.push({ text: "Please Write a Title." });
    }
    if (!body) {
        errors.push({ text: "Please Write a body" });
    }


    if (errors.length > 0) {
        res.status(400).json({ errors: errors })
    } else {
        //New creation
        const newNew = new NewsSchema({ title, body, extract });
        await newNew.save();
        res.status(200).json("Se elimino correctamente.");
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        var editNew = await NewsSchema.findOne({ _id: req.params.id })
    } catch (error) {
        var editNew = null;
    }
    res.render('gestion/news/edit', { editNew });
});

router.put('/edit', async (req, res) => {
    const { id, title, body, extract } = req.body;
    
    const errors = [];

    // Validations and error msg
    if (!title) {
        errors.push({ type: "verification", text: "Please write a Title." });
    }
    if (!body) {
        errors.push({ type: "verification", text: "Please Write a body" });
    }

    if (errors.length > 0) {
        res.status(400).json({ errors: errors, req: req.body})
    } else {
        try {
            await NewsSchema.findOneAndUpdate({ _id: req.params.newsId }, { title, body, extract });
            res.status(200).redirect("/users/gestion/news")
        } catch (e) {
            console.log(e);
            alert("Error")
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const allNews = await NewsSchema.findOneAndRemove({_id: req.params.id});
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error})
    }
});

module.exports = router;