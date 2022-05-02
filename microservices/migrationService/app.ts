import express = require('express');
import { KafkaOrderConsumer } from './controllers/consumerController';
const morgan = require('morgan');


class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.listen();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(morgan('dev')); //
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private listen(): void {
        console.log("Consume is listening...");
        const consumer = KafkaOrderConsumer.getInstance();
        consumer.listenConsumer();
    }
}

export default new App().express;