const asana = require('./asanadbCreds')


const client = "mysql";
const host = "10.111.201.120"
const port = 3307 
const user= "treasuryfx";
const password= "system";
const database= "asana2";

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '10.111.201.120',
        port: 3307,
        user: 'treasuryfx',
        password: 'system',
        database: 'asana2'
    }
});

module.exports = knex;