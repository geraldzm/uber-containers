import { Kafka } from 'kafkajs';
import { OrderRepo } from '../repositories';

/*
Kafka Consumer that migrates orders and order histories from one country to another using sharding.
As update does not work on sharded mongodbs, we remove it manually and edit here the country (Shard Key)
so we can insert the data again, translating the data from one country to the another.
*/
class ConsumerController{

    private static instance : ConsumerController = new ConsumerController();
    private kafka : Kafka;
    private topicName : string;
    private consumerNumber : string;
    
    private constructor(){
        this.kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['25.5.185.77:9092']
        });
        this.topicName = 'orderMigration';
        this.consumerNumber = process.argv[2] || '1';
    }

    public static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ConsumerController();
        return this.instance;
    }

    public async listenConsumer(){
        const kafkaOrderConsumer = this.kafka.consumer({groupId: 'orders'});
        kafkaOrderConsumer.connect()
        .then(() => {
            console.log("Kafka connected");
            kafkaOrderConsumer.subscribe({ topic: this.topicName }).then(()=>{
                console.log("subscribed");
                let orderCounter = 1;
                const orderRepo = new OrderRepo();
                kafkaOrderConsumer.run({
                    eachMessage: async ({ topic, partition, message } : any) => {
                        this.logConsumerMessage(orderCounter, `kafkaOrderConsumer#${this.consumerNumber}`, topic, partition, message);
                        orderCounter++;
                        //migrate data with new Country                
                        const data =  JSON.parse(message.value.toString());
                        const ids  = data.orderIds;
                        const country = data.arrivalCountry;
                        orderRepo.saveUpdatedOrders(ids, country);
                    },
                });  
            }).catch((pError : any) => {
                console.log(pError);
            })
        })
        .catch((pError : any) => {
            console.log(pError);
        });
    }

    private logConsumerMessage(pCounter : any, pConsumerName : any, pTopic : any, pPartition : any, pMessage : any) {
        console.log(`received a new message number: ${pCounter} on ${pConsumerName}: `, {
            pTopic,
            pPartition,
            message: {
                offset: pMessage.offset,
                headers: pMessage.headers,
                value: pMessage.value.toString()
            },
        });
    }
}

export { ConsumerController };