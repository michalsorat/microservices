import express from "express"
const app = express();
import { Client, logger } from "camunda-external-task-client-js";
import open from "open";
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger, asyncResponseTimeout: 10000 };
const client = new Client(config);

client.subscribe("transport-options", async function({ task, taskService }) {
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

    await taskService.complete(task, { variables: { transports } });
});

client.subscribe("payment-options", async function({ task, taskService }) {

    const payments = [
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
    await taskService.complete(task, { variables: { payments } });
});

client.subscribe("user-data", async function({ task, taskService }) {
    const users = {
            "name" : "Michal",
            "last_name" : "Mrkvička",
            "email" : "mrkvicka.michal@gmail.com",
            "street" : "Trakovická",
            "street_nr" : "39",
            "city" : "Piešťany",
            "psc" : "988 09"
    }
    await taskService.complete(task, { variables: { users } });
});

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
    const payments = [
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
    res.status(200).send(payments);
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