const router = require('express').Router();
const { queueRequests } = require('oracledb');
const dbConfig = require("../../config/oracleConnect")

router.get("/myhello", (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
  });

  router.get("/btuser", async(req, res) => {
    try {
      const {moduleId,id} = req.body
      let response = await getBtUser({moduleId,id});      
      if(response.status == "00"){
        res.send(response.data.rows  )
        res.end();
      }else {
        res.send(queueRequests);
        res.end();
      }
      
    } catch (error) {
      res.send("Error");
      res.end();  
    }
  });


router.get("/getidinfo", async(req, res) => {
  
    try {
      let workingResponse = await getidinfo_working("");      
      if(workingResponse.status == "00"){
        res.send(workingResponse.data.rows  )
        res.end();
      }else {
        res.send(queueRequests);
        res.end();
      }
      
    } catch (error) {
      console.log(error);
      res.send("Error");
      res.end();  
    }
});

async function getidinfo_working(identifier){
  return new Promise(async (resolve, reject) =>{
    try {
      const getConnection = await dbConfig.getOracleConnection();
      const getQueryResults = await dbConfig.executeQueryReturnResult(getConnection.data);
      console.log(getQueryResults);
      resolve(getQueryResults)

    } catch (error) {
      
    }
  });
}

async function getBtUser(req){
  
  return new Promise(async(resolve,reject)=>{
    try {
      const getConnection = await dbConfig.getOracleConnection();
      const getBTQuery = await dbConfig.executeBtUserQuery(getConnection.data,req)
      resolve(getBTQuery)

    } catch (error) {
      
    }
  })
}

  module.exports = router;