const router = require('express').Router();

const User = require('../../models/user');

router.get('/', async (req, res) => {
  await User.find({_id: {$ne: req.user._id}}).exec((err, users) => {
    if(err) return res.redirect('/users/gestion');
    res.render('gestion/users', {users});
  });
});


module.exports = router;
