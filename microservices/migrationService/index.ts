import App from './app';
import * as  http from 'http';
import { orderModel, orderHistoryModel } from './model/models';
const mongoose = require('mongoose');

require('dotenv').config();

console.log(`mongo connection ${process.env.MONGO_CONNECTION}`);

// create mongo connection
mongoose.createConnection(process.env.MONGO_CONNECTION).asPromise()
.then((c:any) =>{

    App.locals.actlDB = c.useDb("actul");
    // save mongo conneciton 
    App.locals.orderModel = App.locals.actlDB.model('orders', orderModel);
    App.locals.orderHistoryModel = App.locals.actlDB.model('orderHistories', orderHistoryModel);

    App.set('port', process.env.PORT);
    const server = http.createServer(App);
    server.listen(process.env.PORT);
    
    server.on('listening', () => {

        const addr = server.address() || "";

        const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    });
}).catch((err:any) => {
    console.error('Error creating mongo connection', err);
});
