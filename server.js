const express = require("express");
const app = express();

app.get("/transports", function(req, res) {
    const transports = [
        {
            "name" : "Osobný odber",
            "price" : 0,
            "icon" : "fas fa-hand-holding-usd",
        },
        {
            "name" : "Doručenie na adresu",
            "price" : 4.99,
            "icon" : "fas fa-shipping-fast",
        }
    ]
    res.status(200).send(transports);
});

app.get("/payments", function(req, res) {
    const transports = [
        {
            "name" : "Kartou online",
            "price" : 0,
            "icon" : "fab fa-cc-visa",
        },
        {
            "name" : "Na dobierku",
            "price" : 1.99,
            "icon" : "fas fa-wallet",
        }
    ]
    res.status(200).send(transports);
});

app.get("/user-details", function(req, res) {
    const users = [
        {
            "name" : "Michal",
            "last_name" : "Mrkvička",
            "email" : "mrkvicka.michal@gmail.com",
            "street" : "Trakovická",
            "street_nr" : "39",
            "city" : "Piešťany",
            "psc" : "988 09"
        }
    ]
    res.status(200).send(users[0]);
});

app.listen(3000, function() {
    console.log("Microservice listening on port 3000");
});