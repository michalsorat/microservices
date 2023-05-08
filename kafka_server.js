import { Kafka } from 'kafkajs';
import express from "express"
import mysql from "mysql";
const app = express();

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
    clientId: 'api-producer',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

app.post('/api/trigger-process', async (req, res) => {
    try {
        // Get data from the request body
        const data = req.body;

        // Connect the producer to Kafka and send the message
        await producer.connect();
        await producer.send({
            topic: 'your-topic',
            messages: [{ value: JSON.stringify(data) }]
        });
        await producer.disconnect();

        res.status(200).json({ message: 'Process triggered successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to trigger the process' });
    }
});

app.listen(3001, function () {
    console.log("Kafka listening on port 3000");
});