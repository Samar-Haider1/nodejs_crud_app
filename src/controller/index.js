const router = require('express').Router();

router.use('/creditcard', require('./creditcardcontroller/creditCardController'));

module.exports = router;