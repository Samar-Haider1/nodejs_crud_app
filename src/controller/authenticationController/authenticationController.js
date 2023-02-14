const router = require('express').Router();
const dbConfig = require("../../config/oracleConnect")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { getAuthorizeToken, emailRegex } = require('../../util');
dotenv.config(`${process.env.SECRET_KEY}`);

var queryManager = require("./authQuery");
// const emailRegex = require('../../util');

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
        const token = getAuthorizeToken(req);
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
        const token = getAuthorizeToken(req);
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

async function generateOtp(params) {
    return new Promise(async (resolve,reject)=>{
        try {
        console.log(params);
        } catch (error) {
            
        }
    })
 }
async function verifyUserToken(token) {
    return new Promise(async (resolve, reject) => {

        try {
            const dbConnection = await dbConfig.getOracleConnection();
            let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let queryTesting = null;
            const tokenExpiry = jwt.verify(token, jwtSecretKey);
            if (tokenExpiry) {
                queryTesting = queryManager.verifyUserToken({ KEY1: tokenExpiry.key });
                queryresult = await dbConnection.data.execute(queryTesting.sql, queryTesting.binds, queryTesting.options);
                const verified = queryresult.rows[0].TOKEN === token

                if (verified) {
                    resolve({ status: "00", message: "Successfully Verified" })
                } else {
                    // Access Denied
                    resolve(error)
                }

            } else {
                resolve({ status: "01", message: "Access Denied" })

            }
        } catch (error) {
            // Access Denied
            reject({ status: "01", message: "Access Denied" })

        }
    })

}

async function loginwithJWT(params) {
    return new Promise(async (resolve, reject) => {
        try {
            const dbConnection = await dbConfig.getOracleConnection();
            const getQueryResults = await authenticationExecuteQuery(dbConnection.data, params);

            resolve(getQueryResults)
        } catch (error) {
            resolve({ status: "01", message: "Something went wrong." })

        }
    })
}

async function authenticationExecuteQuery(inComingConnection, queryParams) {
    var returnObject = { status: "", data: "", message: "" };
    return new Promise(async (resolve, reject) => {
        let connection = inComingConnection;
        let queryTesting = null;
        try {
            if (queryParams.TYPE == 'auth') {
                if (emailRegex(queryParams.KEY1)) {

                    queryTesting = queryManager.userLogin(queryParams);
                } else {
                    throw new Error("error")
                }
            } else {
                queryTesting = queryManager.rdaAccountAuth(queryParams);

            }
            if (connection) {
                console.log("Connection connected to oracle");
                result = await connection.execute(queryTesting.sql, queryTesting.binds, queryTesting.options);

                const item = result.rows[0]

                if (result.rows.length > 0) {

                    let jwtSecretKey = process.env.JWT_SECRET_KEY;
                    let data = {
                        key: queryParams.KEY1,
                        time: Date(),
                    }

                    const token = jwt.sign(
                        data,
                        jwtSecretKey,
                        { expiresIn: "1h" });
                    const date = new Date();

                    const query = queryManager.sessionEntries();
                    res = await connection.execute(query.sql, query.binds, query.options);
                    queryTesting = queryManager.userEntries({ ...queryParams, ID: res?.rows[0]?.TOTAL_ENTRIES + 1, TOKEN: token, CREATED_DATETIME: date, LAST_LOGIN: date, IS_NEW_USER: item.IS_NEW_USER });
                    queryresult = await connection.execute(queryTesting.sql, queryTesting.binds, queryTesting.options);
                    // connection.commit();
                    if (queryresult.rowsAffected > 0) {
                        returnObject.status = "00";
                        returnObject.message = "Login Success";
                        const obj = item.IS_NEW_USER === 1 ? { isChangePsd: true } : {}


                        returnObject.data = { TOKEN: token, ...obj }

                    } else {
                        returnObject.status = "01";
                        returnObject.message = "Something Went Wrong";
                        returnObject.data = {}
                    }
                } else {
                    returnObject.status = "01";
                    returnObject.message = "Login Failed";
                    returnObject.data = {}
                }
                resolve(returnObject);
            } else {
                returnObject.status = "01";
                returnObject.message = "Connection Error";
                resolve(returnObject);

            }

        } catch (err) {
            console.log("Error: ", err);
            returnObject.status = "99";
            returnObject.message = "Something Went Wrong ";
            resolve(returnObject);

        } finally {
            if (connection) {
                try {
                    console.log("connection was successfull");
                    await connection.close();
                } catch (err) {
                    console.log("Error when closing the database connection: ", err);
                    await connection.close();
                }
            }
        }
    })
}
async function passwordChange(params) {
    return new Promise(async (resolve, reject) => {
        try {
            const dbConnection = await dbConfig.getOracleConnection();
            const getQueryResults = await passwordChangeExecuteQuery(dbConnection.data, params);
            resolve(getQueryResults)
        } catch (error) {
            resolve({ status: "01", message: "Something went wrong." })

        }
    })
}

async function passwordChangeExecuteQuery(inComingConnection, queryParams) {
    var returnObject = { status: "", data: "", message: "" };
    return new Promise(async (resolve, reject) => {
        let connection = inComingConnection;
        let queryTesting = null;
        try {
            if (connection) {
                console.log("Connection connected to oracle");
                queryTesting = queryManager.changePassword({ KEY1: queryParams.KEY1, KEY2: queryParams.password, IS_NEW_USER: 0 });
                queryresult = await connection.execute(queryTesting.sql, queryTesting.binds, queryTesting.options);

                returnObject.status = "00";
                returnObject.message = "Password Changed Successfully.";
                returnObject.data = "";
                resolve(returnObject);

            } else {
                returnObject.status = "01";
                returnObject.message = "Connection Error";
                resolve(returnObject);
            }

        } catch (err) {
            console.log("Error: ", err);
            returnObject.status = "99";
            returnObject.message = "Something Went Wrong ";
            resolve(returnObject);

        } finally {
            if (connection) {
                try {
                    console.log("connection was successfull");
                    await connection.close();
                } catch (err) {
                    console.log("Error when closing the database connection: ", err);
                    await connection.close();
                }
            }
        }
    })
}

async function registerUser(req) {
    return new Promise(async (resolve, reject) => {

        try {
            const dbConnection = await dbConfig.getOracleConnection();
            const getQueryResults = await registerUserExecution(dbConnection.data, req);
            resolve(getQueryResults)

        } catch (error) {
            reject({ status: "01", message: "Error" })

        }
    })

}

async function registerUserExecution(inComingConnection, queryParams) {
    var returnObject = { status: "", data: "", message: "" };
    return new Promise(async (resolve, reject) => {

        let connection = inComingConnection;
        let queryTesting = null;
        try {
            if (connection) {
                console.log("Connection connected to oracle");
                const date = new Date();
                const query = queryManager.sessionEntries();
                res = await connection.execute(query.sql, query.binds, query.options);
                queryTesting = queryManager.generateUser({ ...queryParams, ID: res?.rows[0]?.TOTAL_ENTRIES + 1, KEY2: "123", IS_NEW_USER: 1, CREATED_DATETIME: date, TYPE: "auth" });
                queryresult = await connection.execute(queryTesting.sql, queryTesting.binds, queryTesting.options);
                connection.commit();
                if (queryresult.rowsAffected > 0) {
                    returnObject.status = "00";
                    returnObject.message = "Register User Successfully";
                    returnObject.data = {}

                } else {
                    returnObject.status = "01";
                    returnObject.message = "Something Went Wrong";
                    returnObject.data = {}
                }

                resolve(returnObject);
            } else {
                returnObject.status = "01";
                returnObject.message = "Connection Error";
                resolve(returnObject);

            }

        } catch (err) {
            console.log("Error: ", err);
            returnObject.status = "99";
            returnObject.message = "Something Went Wrong ";
            resolve(returnObject);


        } finally {
            if (connection) {
                try {
                    console.log("connection was successfull");
                    await connection.close();
                } catch (err) {
                    console.log("Error when closing the database connection: ", err);
                    await connection.close();
                }
            }
        }
    })
}

module.exports = router;