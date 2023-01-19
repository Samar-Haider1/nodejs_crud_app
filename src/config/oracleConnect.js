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
      let options = 

      if (connection) {
        console.log("Successfully connected to Oracle!");
        oracledb.fetchAsString = [oracledb.CLOB];
        result = await connection.execute(
          // queryTesting,[""],
          // queryManager.getGetById("649dbe90-eb05-4a86-b224-daaa6ca5d043"),
          // `select * from USER_REQUEST where id = "c6a65e8d-f743-4812-bef7-6edad56c4580" `,
          // `select * from USER_REQUEST where id = :id `,
          "select * from USER_REQUEST where id = '649dbe90-eb05-4a86-b224-daaa6ca5d043' ",
          // ["649dbe90-eb05-4a86-b224-daaa6ca5d043"],
          // [
          //   // {
          //   //   splitResults: true, //True to enable to split the results into bulks, each bulk will invoke the provided callback (last callback invocation will have empty results)
          //   //   bulkRowsAmount: 100, //The amount of rows to fetch (for splitting results, that is the max rows that the callback will get for each callback invocation)
          //   // },
          //   {
          //     fetchInfo: {
          //       USER_REQUEST: { type: oracledb.OBJECT },
          //     },
          //   },
          // ],
          {
            outFormat: oracledb.OBJECT,
          }
        );
        returnObject.status = "00";
        returnObject.message = "success";
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
