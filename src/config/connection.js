const dbcreds = require('./dbcreds')

const knex = require('knex')({
  client: dbcreds.client,
  connection: {
    user: dbcreds.user,
    password: dbcreds.password,
    connectString:dbcreds.connectString  }
});

module.exports = knex;