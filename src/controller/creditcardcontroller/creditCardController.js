const router = require('express').Router();
const { queueRequests } = require('oracledb');
const dbConfig = require("../../config/oracleConnect")

router.get("/myhello", (req, res) => {
    //   res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    res.send("Hello World!");
  });


router.get("/getidinfo", async(req, res) => {
  
    try {
      console.log(req.body);
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
  
      

      // getQueryResults.data.rows[0].USER_REQUEST = (0, eval)('(' + getQueryResults.data.rows[0].USER_REQUEST + ')');
      console.log(getQueryResults);

      resolve(getQueryResults)

    } catch (error) {
      
    }
  });
}

  module.exports = router;