import { Kafka } from 'kafkajs';
import { OrderRepo } from '../repositories';
import app from '../app';

const url = 'mongodb://25.5.185.77:27017';

class KafkaOrderConsumer{

    private static instance : KafkaOrderConsumer = new KafkaOrderConsumer();
    private kafka : Kafka;
    private topicName : string;
    private consumerNumber : string;
    
    private constructor(){
        this.kafka = new Kafka({
            mongoClientId: 'my-app',
            brokers: ['localhost:9092']
        } as any);
        this.topicName = 'orderCreated';
        this.consumerNumber = process.argv[2] || '1';
    }

    public static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new KafkaOrderConsumer();
        return this.instance;
    }

    public async listenConsumer(){
        const kafkaOrderConsumer = this.kafka.consumer({groupId: 'orders'});
        await Promise.all([
            kafkaOrderConsumer.connect()
        ]);

        await Promise.all([
            await kafkaOrderConsumer.subscribe({ topic: this.topicName }),
        ]);

        let orderCounter = 1;
        await kafkaOrderConsumer.run({
            eachMessage: async ({ topic, partition, message } : any) => {
                this.logConsumerMessage(orderCounter, `kafkaOrderConsumer#${this.consumerNumber}`, topic, partition, message);
                orderCounter++;
                //migrate data with new Country

                //new app.locals.orderHistoryModel(JSON.parse(message.value.toString())).save();
                /*
                Testear pasar 1 order de Italy a Spain en el cluster
                */

                const orderRepo = new OrderRepo();
                //message => model
                orderRepo.saveUpdatedOrder()
            },
        });  
    }

    private logConsumerMessage(counter : any, consumerName : any, topic : any, partition : any, message : any) {
        console.log(`received a new message number: ${counter} on ${consumerName}: `, {
            topic,
            partition,
            message: {
                offset: message.offset,
                headers: message.headers,
                value: message.value.toString()
            },
        });
    }

}

export { KafkaOrderConsumer };