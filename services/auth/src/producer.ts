import {Kafka,Producer,Admin} from 'kafkajs'
import dotenv from 'dotenv';
dotenv.config();
let producer: Producer;
let admin: Admin;

export const connectKafka=async()=>{
    try {
        const kafka = new Kafka({
            clientId:'auth-service',
            brokers:[process.env.KAFKA_BROKER || 'localhost:9092']
        });

    admin = kafka.admin();
    await admin.connect();
     
    const topics = await admin.listTopics();
    if(!topics.includes('send-mail')){
        await admin.createTopics({
            topics:[{topic:'send-mail',numPartitions:1,replicationFactor:1}]
        });
    }
    console.log('✅ Kafka Admin connected and topics are ensured.');

    await admin.disconnect();
    producer = kafka.producer();
    await producer.connect();
    console.log('✅ Kafka Producer connected.');
    } catch (error) {
        console.error('Error connecting to Kafka:', error); 
    }
}

export const publishTopic = async(topic:string,message:any)=>{
    if(!producer){
        console.error('Producer is not connected.');
        return;
    }
    try {
        await producer.send({
            topic,
            messages: [
                { 
                    value: JSON.stringify(message) 
                }
            ]
        })
    } catch (error) {
        console.error('❌ Error publishing message to topic:', error);
    }
}

export const disconnectKafka=async()=>{
    try {
        if(producer){   
            await producer.disconnect();
            console.log('✅ Kafka Producer disconnected.');     
        } 
    } catch (error) {
        console.error('Error disconnecting Kafka producer:', error);
    }
}