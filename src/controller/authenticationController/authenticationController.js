const router = require('express').Router();
const oracledb = require('oracledb');

const dbConfig = require("../../config/oracleConnect")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config(`${process.env.SECRET_KEY}`);

var queryManager = require("./authQuery");

router.post("/login", async (req, res) => {
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

router.get("/verifyToken",async(req,res)=>{
    
    const dbConnection = await dbConfig.getOracleConnection();
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let queryTesting = null;
    try {
        const token = req.headers.authorization.split(" ")[1];
        queryTesting = queryManager.verifyUserToken({EMAIL:req.body.EMAIL});        
        queryresult = await dbConnection.data.execute(queryTesting.sql,queryTesting.binds,queryTesting.options);
        const verified = queryresult.rows[0].TOKEN === token
        if(verified){
            const tokenExpiry = jwt.verify(token, jwtSecretKey);
            if(tokenExpiry){
                return res.send("Successfully Verified");
            }else{
                // Access Denied
                return res.status(401).send(error);
            }
    
        }else{
            return res.send("Access Denied");

        }
    } catch (error) {
        // Access Denied
        return res.status(401).send("Access Denied");
    }
      
})

async function loginwithJWT(params){
    return new Promise(async(resolve,reject)=>{
        try {
            const dbConnection = await dbConfig.getOracleConnection();
            const getQueryResults = await authenticationExecuteQuery(dbConnection.data,params);
            
            resolve(getQueryResults)
        } catch (error) {
            
        }
    })
}

async function authenticationExecuteQuery(inComingConnection,queryParams){
var returnObject = {status:"",data:"",message:""};
return new Promise(async (resolve,reject)=>{
    let connection = inComingConnection;
    let queryTesting = null;
    try {
        queryTesting = queryManager.userLogin(queryParams);
        if (connection) {
            console.log("Connection connected to oracle");
            result = await connection.execute(queryTesting.sql,queryTesting.binds,queryTesting.options);
            if(result.rows.length > 0){
                let jwtSecretKey = process.env.JWT_SECRET_KEY;
                let data = {
                    email:queryParams.EMAIL,
                    time: Date(),
                }
              
                const token = jwt.sign(
                  data,
                  jwtSecretKey,
                  { expiresIn: "90s" });
                  const date = new Date();
                  queryTesting = queryManager.userEntries({...queryParams,TOKEN:token,LAST_LOGIN:date});                
                  queryresult = await connection.execute(queryTesting.sql,queryTesting.binds,queryTesting.options);
                  connection.commit();
                  if(queryresult.rowsAffected > 0){
                    returnObject.status = "00";
                    returnObject.message="Login Success";
                    returnObject.data = {...result.rows[0],TOKEN:token}
    
                  }else{
                    returnObject.status = "01";
                    returnObject.message="Something Went Wrong";
                    returnObject.data = {}
                  }    
            }else{
                returnObject.status = "01";
                returnObject.message="Login Failed";
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
        returnObject.message = "Exception: " + err;
          
    }finally {
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