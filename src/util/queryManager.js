var oracledb = require("oracledb");

module.exports.getGetById = function(id){
    // let query = `select * from USER_REQUEST where id = '649dbe90-eb05-4a86-b224-daaa6ca5d043' `
    // let query = "select * from USER_REQUEST where id = '649dbe90-eb05-4a86-b224-daaa6ca5d043'"

    let sql = `select * from USER_REQUEST where id = :id `
    let binds = {":id": id}
    let options = {
        outFormat: oracledb.OBJECT,
      }
    return {sql, binds, options};
    // return "select * from USER_REQUEST where id = "+ "\""+"649dbe90-eb05-4a86-b224-daaa6ca5d043" + "\"";
}

module.exports.getuserByProfileId = function(id,moduleId){
    let sql = `select * from BTUSER.USER_REQUEST where id = :id and BACK_END_MODULE = :moduleId `
    let binds = {":id": id,":moduleId":moduleId}
    let options = {
        outFormat: oracledb.OBJECT,
      }
    return {sql, binds, options};
}
