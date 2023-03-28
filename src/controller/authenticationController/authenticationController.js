const router = require('express').Router();
const { getAuthorizeToken } = require('../../util');
var { generateOtp, verifyUserToken, loginwithJWT, passwordChange, registerUser, authenORM } = require('./features')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const knex = require('../../config/connection');
const { getTableName } = require('../../models/authUser/AuthUserModel');

router.post("/login", async (req, res) => {
    try {

        // let response = await loginwithJWT(req.body);

        let response = await authenORM(req.body)
        res.send(response);


    } catch (error) {
        res.send("Error");
        res.end();

    }
})
router.post("/authentication", async (req, res) => {
    try {
        let response = await loginwithJWT(req.body);

        if (response.status == "00") {
            res.send(response);
            res.end();

        } else {
            res.send(response);
            res.end();
        }
    } catch (error) {
        res.send("Error");
        res.end();

    }
})

router.get("/verifyToken", async (req, res) => {
    try {
        const token = await getAuthorizeToken(req);
        let response = await verifyUserToken(token);
        if (response.status == "00") {
            res.send(response);
            res.end();

        } else {
            res.status(401).send(error);

            res.end();
        }
    } catch (error) {
        res.status(401).send(error);
        res.end();

    }

})

router.post("/register", async (req, res) => {
    try {
        let response = await registerUser(req.body);
        res.send(response);
        res.end();

    } catch (error) {
        res.send("Error");
        res.end();

    }
})
router.post("/changepassword", async (req, res) => {
    try {
        const token = await getAuthorizeToken(req);
        let verifyTokenResp = await verifyUserToken(token);
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const tokenExpiry = jwt.verify(token, jwtSecretKey);

        if (verifyTokenResp) {
            let response = await passwordChange({ KEY1: tokenExpiry.key, password: req.body.password });
            res.send(response);
            res.end();



        } else {
            res.send(verifyTokenResp);
            res.end();

        }
    } catch (error) {
        res.send("Error");
        res.end();

    }
})

router.post("/generateOtp", async (req, res) => {
    try {
        let response = await generateOtp(req);
        if (response.status === "00") {
            res.send(response);
            res.end();
        }

    } catch (error) {
        res.send("Error");
        res.end();

    }
})

module.exports = router;