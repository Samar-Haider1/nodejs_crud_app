const router = require('express').Router();
const dbConfig = require("../../config/oracleConnect")

router.get("/myhello", (req, res) => {
    //   res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    res.send("Hello World!");
  });


router.get("/getidinfo", async(req, res) => {
  
    //   res.header("Access-Control-Allow-Origin", "*");
    
    
    try {
      console.log(req.body);
      getidinfo_working("");
      res.send("Hello World!");  
    } catch (error) {
      
    }
});

async function getidinfo_working(identifier){
  return new Promise(async (resolve, reject) =>{
    try {
      const getConnection = await dbConfig.getOracleConnection();
      const getQueryResults = await dbConfig.executeQueryReturnResult(getConnection.data);
  

      getQueryResults.data.rows[0].USER_REQUEST = (0, eval)('(' + getQueryResults.data.rows[0].USER_REQUEST + ')');
      console.log(getQueryResults.data.rows[0]);



    } catch (error) {
      
    }
  });
}

  module.exports = router;