import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'api-consumer',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'api-group' });

const consumeMessage = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'your-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message: ${message.value.toString()}`);
            // Process the message here
        }
    });
};

consumeMessage().catch(console.error);