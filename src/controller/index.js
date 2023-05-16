const router = require('express').Router();

router.use('/creditcard', require('./creditcardcontroller/creditCardController'));
router.use('/auth', require('./authenticationController/authenticationController'));
router.use('/asana', require('./asanaController/asanaController'));
router.use('/ebdigital', require('./ebdigitalController/index'));

module.exports = router;