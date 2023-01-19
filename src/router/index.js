const router = require('express').Router();


router.use('/api/v1', require('../controller/'));


module.exports = router;