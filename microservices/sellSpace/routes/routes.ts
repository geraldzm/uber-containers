import express = require('express');
import { spacesrouter } from './spacesrouter';

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
        this.express.use('/spaces', spacesrouter);
    }
}

export default new Routes().express;
