// const knex = require("../../config/asanadbConnection")
const { getTableName } = require("./model")

const knex = require('knex')({
  client: 'mysql',
  connection: {
      host: "10.111.201.120",
      port: 3307,
      user: "treasuryfx",
      password: "system",
      database: "asana2"
  }
});

module.exports.getAllTasks = async function () {
    return new Promise(async (resolve, reject) => {
      await knex("task").then((response) => {
        debugger
        resolve({ status: "00", message: "Success", data: response })
    })
    .catch((err) => {
        debugger
      resolve({ status: "01", message: "Connection Error" })
    })
    })
  }