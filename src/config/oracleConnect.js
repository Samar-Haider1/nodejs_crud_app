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
      queryTesting = queryManager.getGetById("9129ac36-4814-46e6-b7d4-89313b78ff75");

      if (connection) {
        console.log("Successfully connected to Oracle!");
        oracledb.fetchAsString = [oracledb.CLOB];
        result = await connection.execute(queryTesting.sql,
          queryTesting.binds,
          queryTesting.options
        );
        connection.commit();
        returnObject.status = "00";
        returnObject.message = "success";
        result.rows[0].USER_REQUEST = (0, eval)('(' + result.rows[0].USER_REQUEST + ')');
        returnObject.data = result;

        resolve(returnObject);
      } else {
        returnObject.status = "01";
        returnObject.message = "Connection Error";
      }
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
module.exports.executeBtUserQuery = async function (
  inComingConnection,
  queryParams
) {
  var returnObject = { status: "", data: "", message: "" };
  return new Promise(async (resolve, reject) => {
    let connection = inComingConnection;
    let queryTesting = null;
    try {
      queryTesting = queryManager.getuserByProfileId(queryParams.id, queryParams.moduleId);

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
        password: "userbt121",
        connectString:
          "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 10.111.201.33)(PORT = 1551))(CONNECT_DATA =(SID= btuata)))",
      });

      oracledb.autoCommit = true;

      returnObject.status = "00";
      returnObject.data = connection;
      resolve(returnObject);
    } catch (error) {
      console.log(error);
      returnObject.status = "99";
      returnObject.data = "connection error";
      resolve(false);
    }
  });
};
