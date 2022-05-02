import express = require('express');
import { ConsumerController } from './controllers/consumerController';
import morgan from 'morgan';

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
        console.log("Consumer is listening...");
        const consumer = ConsumerController.getInstance();
        consumer.listenConsumer();
    }
}

export default new App().express;