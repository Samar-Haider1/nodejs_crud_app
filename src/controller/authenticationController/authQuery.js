var oracledb = require("oracledb");

module.exports.userLogin = function({EMAIL,PASSWORD}){

    let sql = `select TOKEN from BTUSER.JWT_USER where EMAIL= :EMAIL and PASSWORD= :PASSWORD`;

    let binds = {":EMAIL": EMAIL,":PASSWORD": PASSWORD};
    let options = {
      outFormat:oracledb.OBJECT
    }
    return { sql,binds,options}
  }
  // module.exports.userEntries = function({ID=3,ATTEMPTS=1,EMAIL,TOKEN,IS_ACTIVE=1,LAST_LOGIN,PASSWORD}){

  module.exports.userEntries = function({EMAIL,TOKEN,LAST_LOGIN,PASSWORD}){
  let sql = `INSERT INTO BTUSER.JWT_USER (ID,ATTEMPTS,EMAIL,TOKEN,IS_ACTIVE,LAST_LOGIN,PASSWORD) VALUES('4',1,:EMAIL,:TOKEN,1,:LAST_LOGIN,:PASSWORD)`;
  let binds = {":EMAIL": EMAIL,":TOKEN":TOKEN,":LAST_LOGIN":LAST_LOGIN,":PASSWORD": PASSWORD};
  let options = {
    outFormat:oracledb.OBJECT
  }
  return { sql,binds,options}
}

module.exports.verifyUserToken = function({EMAIL}){
    // let sql = `Update BTUSER.JWT_USER set TOKEN= :TOKEN, ATTEMPTS= ATTEMPTS+1,LAST_LOGIN= :LAST_LOGIN where EMAIL= :EMAIL`;
    let sql = `select * from BTUSER.JWT_USER where EMAIL= :EMAIL order by LAST_LOGIN DESC`;   
    let binds = {":EMAIL": EMAIL,};
    let options = {
      outFormat:oracledb.OBJECT
    }
    return { sql,binds,options}
  }