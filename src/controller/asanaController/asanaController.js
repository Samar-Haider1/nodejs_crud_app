const { getAllTasks } = require('./querys');

const router = require('express').Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "10.111.201.120",
    user: "treasuryfx",
    password: "system",
    port: 3307,
    debug:true,
    database: "asana2",
    multipleStatements: true
});

router.get("/tasks", async (req, res) => {
    try {

        // let response = await getAllTasks();



        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
        debugger
        res.send(response);
    } catch (error) {
        res.send("Error");
        res.end();
    }
})


module.exports = router;