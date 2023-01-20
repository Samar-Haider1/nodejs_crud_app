var oracledb = require("oracledb");
var queryManager = require("../util/queryManager");


module.exports.executeQueryReturnResult = async function (
  inComingConnection,
  queryToExecute
) {
  var returnObject = { status: "", data: "", message: "" };
  return new Promise(async (resolve, reject) => {
    let connection = inComingConnection;
    let queryTesting = null;
    try {
      // connection = await oracledb.getConnection({
      //   user: "btuser",
      //   password: "btuser",
      //   connectString:
      //     "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1522))(CONNECT_DATA =(SID= XE)))",
      // });

      // connection = await this.getOracleConnection();
      queryTesting = queryManager.getGetById("649dbe90-eb05-4a86-b224-daaa6ca5d043"); 
      
     


      if (connection) {
        console.log("Successfully connected to Oracle!");
        oracledb.fetchAsString = [oracledb.CLOB];
        result = await connection.execute(queryTesting.sql, 
                                          queryTesting.binds, 
                                          queryTesting.options
                                          );
        returnObject.status = "00";
        returnObject.message = "success";
        result.rows[0].USER_REQUEST = (0, eval)('(' + result.rows[0].USER_REQUEST + ')');
        returnObject.data = result;

        resolve(returnObject);
      } else {
        returnObject.status = "01";
        returnObject.message = "Connection Error";
      }
      // console.log(JSON.stringify(result));
      resolve(returnObject);
    } catch (err) {
      console.log("Error: ", err);
      returnObject.status = "99";
      returnObject.message = "Exception: " + err;
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
  });
};

module.exports.getOracleConnection = async function () {
  let returnObject = { status: "", data: "", message: "" };
  return new Promise(async (resolve, reject) => {
    try {
      let connection = await oracledb.getConnection({
        user: "btuser",
        password: "btuser",
        connectString:
          "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1522))(CONNECT_DATA =(SID= XE)))",
      });
      returnObject.status = "00";
      returnObject.data = connection;
      resolve(returnObject);
    } catch (error) {
      returnObject.status = "99";
      returnObject.data = "connection error";
      resolve(false);
    }
  });
};
// module.exports = oraclePromisify();
