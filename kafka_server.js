import { Kafka } from "kafkajs";
import express from "express"
import mysql from "mysql";
import dateFormat from "dateformat";
const app = express();
const PORT = 3001;

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "sellphone"
})

db.connect(function (err) {
    if (err) throw err;
    console.log("connected");
})

const kafka = new Kafka({
    clientId: "api-producer",
    brokers: ["localhost:9092"]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "api-group" });

const setUserData = async (message) => {
    const userData = JSON.parse(message.value);
    let userId = userData.user_id;
    const name = userData.name;
    const lastName = userData.last_name;
    const email = userData.email;
    const street = userData.street;
    const streetNr = userData.street_nr;
    const city = userData.city;
    const psc = userData.psc;
    const status = userData.status;

    if (userId == null) {
        userId = 0;
    }

    let date = new Date();
    date = dateFormat(date, "yyyy-mm-dd HH:MM:ss");

    const query = `INSERT INTO orders (user_id, name, last_name, email, street, street_nr, city, psc, status, created_at, updated_at) VALUES (${userId}, "${name}", "${lastName}", "${email}", "${street}", "${streetNr}", "${city}", "${psc}", "${status}", "${date}", "${date}")`;

    if (name != null && lastName != null && email != null && street != null && streetNr != null && city != null && psc != null && status != null) {
        db.query(query, function (error, result) {
            if (error) throw error;
            console.log("Customer data saved. Order ID: " + result.insertId);
        });
    }
};

const setTransportOption = async (message) => {
    const transportData = JSON.parse(message.value);
    const transport = transportData.transport_name;

    const query = `UPDATE orders SET transport_name = "${transport}" WHERE id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)`;

    db.query(query, function (error) {
        if (error) throw error;
        console.log("Transport data saved.");
    });
}

const setPaymentOption = async (message) => {
    const paymentData = JSON.parse(message.value);
    const payment = paymentData.payment_name;
    const query = `UPDATE orders SET payment_name = "${payment}" WHERE id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)`;

    db.query(query, function (error) {
        if (error) throw error;
        console.log("Payment data saved.");
    });
}

const triggerProcess = async (topic, data) => {
    await producer.send({
        topic,
        messages: [{ value: data, partition: 0 }]
    });
    console.log(`Triggered topic: ${topic}`);
};

const executeProcesses = async (topics) => {
    await consumer.connect();
    for (const topic of topics) {
        await consumer.subscribe({ topic });
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Topic that came -> ", topic)
            if (topic === "customer-data") {
                // console.log(`Subscribed topic: ${topic}`);
                await setUserData(message);
            } else if (topic === "transport-options") {
                // console.log(`Subscribed topic: ${topic}`);
                await setTransportOption(message);
            } else if (topic === "payment-options") {
                // console.log(`Subscribed topic: ${topic}`);
                await setPaymentOption(message);
            }
        },
    });
};

app.post("/trigger-kafka-process", async (req, res) => {
    try {
        req.on("data", async function (data) {
            const reqBody = JSON.parse(data);
            await producer.connect();

            await triggerProcess("customer-data", JSON.stringify(reqBody));
            await triggerProcess("transport-options", JSON.stringify(reqBody));
            await triggerProcess("payment-options", JSON.stringify(reqBody));

            await producer.disconnect();

            res.status(200).json({ message: "Processes triggered successfully" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to trigger the processes" });
    }
});

app.listen(PORT, function () {
    console.log(`Kafka server listening on port: ${PORT}`);
});

await executeProcesses(["customer-data", "transport-options", "payment-options"]);