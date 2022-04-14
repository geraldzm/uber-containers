import express = require('express');
// import { Logger } from '../common';
import { consultrouter } from './testrouter';

class Routes {

    public express: express.Application;
    // public logger: Logger;

    constructor() {
        this.express = express();
        // this.logger = new Logger();

        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.use('/test', consultrouter);
        // this.logger.info("route loaded");
    }
}

export default new Routes().express;
