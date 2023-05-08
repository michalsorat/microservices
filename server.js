import express from "express"
const app = express();
import { Client, logger, Variables } from "camunda-external-task-client-js";
import mysql from "mysql";
import dateFormat from "dateformat";
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger, asyncResponseTimeout: 10000 };
const client = new Client(config);

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "sellphone"
})

db.connect(function (err) {
    if (err) throw err;
    console.log("connected");
})

client.subscribe("customer-data", async function ({ task, taskService }) {
    var userId = task.variables.get("user_id");
    var name = task.variables.get("name");
    var lastName = task.variables.get("last_name");
    var email = task.variables.get("email");
    var street = task.variables.get("street");
    var streetNr = task.variables.get("street_nr");
    var city = task.variables.get("city");
    var psc = task.variables.get("psc");
    var status = task.variables.get("status");

    if (userId == null) {
        userId = 0;
    }

    var date = new Date();
    date = dateFormat(date, "yyyy-mm-dd HH:MM:ss");

    var query = `INSERT INTO orders (user_id, name, last_name, email, street, street_nr, city, psc, status, created_at, updated_at) VALUES (${userId}, '${name}', '${lastName}', '${email}', '${street}', '${streetNr}', '${city}', '${psc}', '${status}', '${date}', '${date}')`;

    if (name != null && lastName != null && email != null && street != null && streetNr != null && city != null && psc != null && status != null) {
        db.query(query, function (error, result) {
            if (error) throw error;
            console.log("Customer data saved. Order ID: " + result.insertId);
        });
    }

    await taskService.complete(task);
});

client.subscribe("transport-options", async function ({ task, taskService }) {
    const transport = task.variables.get("transport_name");
    // if (transport != "Osobný odber" && transport != "Doručenie na adresu") {
    //     throw "Transport method is not valid!"
    // }
    const query = `UPDATE orders SET transport_name = '${transport}' WHERE id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)`;

    db.query(query, function (error, result) {
        if (error) throw error;
        console.log("Transport data saved.");
    });

    await taskService.complete(task);
});

client.subscribe("payment-options", async function ({ task, taskService }) {
    const payment = task.variables.get("payment_name");
    // if (transport != "Osobný odber" && transport != "Doručenie na adresu") {
    //     throw "Transport method is not valid!"
    // }
    const query = `UPDATE orders SET payment_name = '${payment}' WHERE id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)`;

    db.query(query, function (error, result) {
        if (error) throw error;
        console.log("Payment data saved.");
    });

    await taskService.complete(task);
});

app.get("/transports", function (req, res) {
    const transports = [
        {
            "name": "Osobný odber",
            "price": 0,
            "icon": "fas fa-hand-holding-usd",
        },
        {
            "name": "Doručenie na adresu",
            "price": 4.99,
            "icon": "fas fa-shipping-fast",
        }
    ]
    res.status(200).send(transports);
});

app.get("/payments", function (req, res) {
    const payments = [
        {
            "name": "Kartou online",
            "price": 0,
            "icon": "fab fa-cc-visa",
        },
        {
            "name": "Na dobierku",
            "price": 1.99,
            "icon": "fas fa-wallet",
        }
    ]
    res.status(200).send(payments);
});

app.get("/user-details", function (req, res) {
    const users = [
        {
            "name": "Michal",
            "last_name": "Mrkvička",
            "email": "mrkvicka.michal@gmail.com",
            "street": "Trakovická",
            "street_nr": "39",
            "city": "Piešťany",
            "psc": "988 09"
        }
    ]
    res.status(200).send(users[0]);
});

app.listen(3000, function () {
    console.log("Microservice listening on port 3000");
});
