module.exports.getGetById = function(id){
    // let query = `select * from USER_REQUEST where id = '649dbe90-eb05-4a86-b224-daaa6ca5d043' `
    let query = "select * from USER_REQUEST where id = '649dbe90-eb05-4a86-b224-daaa6ca5d043'"

    console.log(query.toString())
    console.log();
    return query;
    // return "select * from USER_REQUEST where id = "+ "\""+"649dbe90-eb05-4a86-b224-daaa6ca5d043" + "\"";
}