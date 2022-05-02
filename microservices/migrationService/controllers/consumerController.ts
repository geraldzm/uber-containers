import { Kafka } from 'kafkajs';
import { OrderRepo } from '../repositories';


const url = 'mongodb://25.5.185.77:27017';

class KafkaOrderConsumer{

    private static instance : KafkaOrderConsumer = new KafkaOrderConsumer();
    private kafka : Kafka;
    private topicName : string;
    private consumerNumber : string;
    
    private constructor(){
        this.kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['localhost:9092']
        });
        this.topicName = 'orderMigration';
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
                        //Testear pasar 1 order de Italy a Spain en el cluster
                        const data : string[] =  JSON.parse(message.value.toString());
                        orderRepo.saveUpdatedOrders(data);
                    },
                });  
            }).catch((err) => {
                console.log(err);
                

            })
        })
        .catch((err) => {
            console.log(err);
            
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