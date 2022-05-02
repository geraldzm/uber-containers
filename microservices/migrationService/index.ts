import App from './app';
import * as  http from 'http';
import { orderModel, orderHistoryModel } from './model/models';
import mongoose from 'mongoose';
require('dotenv').config();

// create mongo connection
const uri = process.env.MONGO_PREFIX_URI as string + 
            process.env.MONGO_ROUTER1 as string + "," + 
            process.env.MONGO_ROUTER2 as string;
mongoose.createConnection(uri).asPromise()
.then((c:any) =>{
    console.log(`mongo connection ${uri}`);
    App.locals.actlDB = c.useDb("actul");
    // save mongo conneciton 
    App.locals.orderModel = App.locals.actlDB.model('orders', orderModel);
    App.locals.orderHistoryModel = App.locals.actlDB.model('orderhistories', orderHistoryModel);

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
