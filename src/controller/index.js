const router = require('express').Router();

router.use('/creditcard', require('./creditcardcontroller/creditCardController'));
router.use('/auth', require('./authenticationController/authenticationController'));

module.exports = router;