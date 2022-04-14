import express = require('express');
import Routes from './routes/routes'
const morgan = require('morgan');


class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(morgan('dev')); //
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.use('/api', Routes);

        this.express.use('*', (req,res) => {
            res.send("Request invalido");
        });
    }
}

export default new App().express;