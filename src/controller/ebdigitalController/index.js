const router = require('express').Router();

// var { generateOtp, verifyUserToken, loginwithJWT, passwordChange, registerUser, authenORM } = require('./features')

router.post("/aof", async (req, res) => {
    try {

        let response = await ebAccountOpening(req.body)
        res.send(response);
    } catch (error) {
        res.send("Error");
        res.end();
    }
})
router.get("/", async (req, res) => {
    try {

        res.send("Running");
    } catch (error) {
        res.send("Error");
        res.end();
    }
})

module.exports = router;