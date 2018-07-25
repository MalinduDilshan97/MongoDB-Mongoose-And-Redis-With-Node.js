const express = require('express');
const bodyParser = require('body-parser')

let {mongoose} = require("./db/mongooseConfig");
let {Customer} = require('./models/customer');

let app = express();

app.use(bodyParser.json());

var redisClient = require('redis').createClient;
var redis = redisClient(6379, "localhost");

var access = require('./access.js');


app.post('/customer', function(req,res) {
    if (!req.body.name || !req.body.address)
        res.status(400).send("Please send a name and an address");
    else {
        access.saveBook(req.body.name, req.body.address,function(err) {
            if (err)
                res.status(500).send("Server error");
            else
                res.status(201).send("Saved");
        });
    }
});

app.get('/customer/:name', function(req,res) {
    if (!req.param('name'))
        res.status(400).send("Please send a proper name");
    else {
        access.findCustomerByNameCached(redis, req.param('name'), function(customer) {
            if (!customer)
                res.status(500).send("Server error");
            else
                res.status(200).send(customer);
        });
    }
});


app.put('/customer/:id', function(req,res) {
    if (!req.body.name || !req.body.address)
        res.status(400).send("Please send a name and an address");
    else {
        access.updateCustomer(redis, req.param("id"),req.body.name, req.body.address, function(err) {
            if(err == "Missing customer")
                res.status(404).send("customer not found");
            else if(err)
                res.status(500).send("Server error");
            else
                res.status(200).send("Updated");
        });
    }
});


app.listen(3000,()=>{
    console.log('server is running in port 3000');
});
