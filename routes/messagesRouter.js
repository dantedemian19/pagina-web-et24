const router = require('express').Router();

const Message = require('../models/message');

router.post('/', async (req, res) => {
  let msgOptions = {
    email: req.body.email,
    subject: req.body.subject,
    content: req.body.content
  }

  if(req.isAuthenticated()){
    msgOptions.email = req.user.email;
    msgOptions.author = req.user._id;
  }

  const newMessage = new Message(msgOptions);

  try {
    if (req.isAuthenticated()) await newMessage.save({ validateBeforeSave: false });
    else await newMessage.save();
    return res.status(200).send("Se recibio.");
  } catch (err) {
    console.log(err);
    var err_info = {};
    for (var attribute in err.errors) {
      if (err.errors.hasOwnProperty(attribute)) {
        err_info[attribute] = err.errors[attribute].properties['message'];
      }
    }
    res.status(400).json(err_info);
  }
});


module.exports = router;
