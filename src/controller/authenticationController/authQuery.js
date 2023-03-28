var oracledb = require("oracledb");
const knex = require("../../config/connection");
const { getTableName } = require("../../models/authUser/AuthUserModel");

module.exports.userLogin = function ({ KEY1, KEY2 }) {
  let sql = `select * from BTUSER.JWT_USER where KEY1= :KEY1 and KEY2= :KEY2 order by CREATED_DATETIME DESC`;
  let binds = { ":KEY1": KEY1, ":KEY2": KEY2 };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}
module.exports.rdaAccountAuth = function ({ KEY1, KEY2 }) {

  let sql = `select * from BTUSER.RDA_ACCOUNT_PERSONAL where RDA_ID= :KEY1 and ID_DOCUMENT_NUMBER= :KEY2`;
  let binds = { ":KEY1": KEY1, ":KEY2": KEY2 };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}

module.exports.userEntries = function ({ KEY1, TOKEN, ID, KEY2, IS_NEW_USER, CREATED_DATETIME, TYPE }) {
  let sql = `INSERT INTO BTUSER.JWT_USER (ID,KEY1,TOKEN,KEY2,IS_NEW_USER,CREATED_DATETIME,TYPE) VALUES(:ID,:KEY1,:TOKEN,:KEY2,:IS_NEW_USER,:CREATED_DATETIME,:TYPE)`;
  let binds = { ":KEY1": KEY1, ":TOKEN": TOKEN, ":ID": ID, ":KEY2": KEY2, ":IS_NEW_USER": IS_NEW_USER, ":CREATED_DATETIME": CREATED_DATETIME, ":TYPE": TYPE };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}

module.exports.verifyUserToken = function ({ KEY1 }) {
  let sql = `select * from BTUSER.JWT_USER where KEY1= :KEY1 ORDER BY CREATED_DATETIME DESC`;
  let binds = { ":KEY1": KEY1 };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}

module.exports.generateUser = function ({ KEY1, ID, KEY2, IS_NEW_USER, CREATED_DATETIME, TYPE }) {
  let sql = `INSERT INTO BTUSER.JWT_USER (ID,KEY1,TOKEN,KEY2,IS_NEW_USER,CREATED_DATETIME,TYPE) VALUES(:ID,:KEY1,'',:KEY2,:IS_NEW_USER,:CREATED_DATETIME,:TYPE)`;
  let binds = { ":KEY1": KEY1, ":ID": ID, ":KEY2": KEY2, ":IS_NEW_USER": IS_NEW_USER, ":CREATED_DATETIME": CREATED_DATETIME, ":TYPE": TYPE };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}


module.exports.changePassword = function ({ KEY2, KEY1, IS_NEW_USER }) {
  let sql = `UPDATE BTUSER.JWT_USER SET KEY2= :KEY2, IS_NEW_USER= :IS_NEW_USER WHERE KEY1= :KEY1`;
  let binds = { ":KEY2": KEY2, ":IS_NEW_USER": IS_NEW_USER, ":KEY1": KEY1 };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}

module.exports.sessionEntries = function () {
  let sql = `select COUNT(*) TOTAL_ENTRIES from BTUSER.JWT_USER`;
  let binds = {};
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}
module.exports.generateOtpQuery = function ({ ID, EMAIL, CREATED_DATETIME, OTP, IS_OTP_VERIFIED }) {
  let sql = `INSERT INTO BTUSER.JWT_USER (ID,EMAIL,CREATED_DATETIME,OTP,IS_OTP_VERIFIED) VALUES(:ID,:EMAIL,:CREATED_DATETIME,:OTP,:IS_OTP_VERIFIED)`;
  let binds = { ":ID": ID, ":EMAIL": EMAIL, ":CREATED_DATETIME": CREATED_DATETIME, ":OTP": OTP, ":IS_OTP_VERIFIED": IS_OTP_VERIFIED };
  let options = {
    outFormat: oracledb.OBJECT
  }
  return { sql, binds, options }
}

module.exports.loginUser = async function ({ KEY1, KEY2 }) {
  return new Promise(async (resolve, reject) => {
    await knex(getTableName()).where({ "KEY1": KEY1, "KEY2": KEY2 })
    .orderBy('CREATED_DATETIME', 'desc').then((response) => {

      resolve({ status: "00", message: "Success", data: response })
  })
  .catch((err) => {
    resolve({ status: "01", message: "Connection Error" })
  })
  })
}

module.exports.sessionEntriesCount = async function () {
  return new Promise(async (resolve, reject) => {
    await knex(getTableName()).count('*',{as:'TOTAL_ENTRIES'})
    .then((response) => {
      resolve({ status: "00", message: "Success", data: response })
  })
  .catch((err) => {
    resolve({ status: "01", message: "Connection Error" })
  })
  })
}
