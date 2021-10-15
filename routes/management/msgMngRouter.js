const router = require('express').Router();

const Message = require('../../models/message');
const Answer = require('../../models/msgAnswer');

router.get('/', async (req, res) => {
  await Message.find().sort({date: -1}).limit(10).populate('author', ['_id', 'name']).populate('answer').exec((err, messages) => {
    if (err) return res.redirect('/users/gestion');
    // console.log(messages);
    res.render('gestion/messages', {messages});
  });
});

router.get('/:id', async (req, res) => {
  let messageId = req.params.id;
  await Message.findById(messageId).populate('author', ['_id', 'name']).populate('answer').exec((err, message) => {
    if (err){
      console.log(err);
      return res.redirect('/users/gestion/mensajes');
    }
    res.render('gestion/messageView', {message});
  });
});

router.post('/:id/answer', async (req, res) => {
  let messageId = req.params.id;
  let anwsOp = {content} = req.body;

  const answer = new Answer(anwsOp);

  await Message.findById(messageId).exec(async(err, message) => {
    if(err) return res.redirect(`/users/gestion/mensajes/${messageId}`);
    message.answer = await answer.save();
    try {
      await message.save({ validateBeforeSave: false });
      res.redirect('/users/gestion/mensajes');
    } catch (e) {
      console.log(e);
      res.redirect(`/users/gestion/mensajes/${messageId}`);
    }
  });
});

//{author: {$exists: false}}

module.exports = router;
