import App from './app';
import * as  http from 'http';
import { createClient } from 'redis';
import { containerModel, orderModel, orderHistoryModel } from './model/models';
const mongoose = require('mongoose');

require('dotenv').config();

console.log(`mongo connection ${process.env.MONGO_CONNECTION}`);
console.log(`redis connection ${process.env.REDIS_CONNECTION}`);


// create mongo connection
mongoose.createConnection(process.env.MONGO_CONNECTION).asPromise()
.then((c:any) =>{

    App.locals.actlDB = c.useDb("actul");
    App.locals.orderDB = c.useDb("order");
    
    // create redis connection
    const redisClient = createClient({
        url: process.env.REDIS_CONNECTION
    });
    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    redisClient.connect().then(() => {

        // save mongo conneciton 
        App.locals.containerModel = App.locals.actlDB.model('containers', containerModel);
        App.locals.orderModel = App.locals.actlDB.model('orders', orderModel);
        App.locals.orderHistoryModel = App.locals.actlDB.model('orderHistory', orderHistoryModel);

        // save redis conneciton 
        App.locals.redis = redisClient;

        // start server
        App.set('port', process.env.PORT);
        const server = http.createServer(App);
        server.listen(process.env.PORT);
        
        server.on('listening', () => {
    
            const addr = server.address() || "";
    
            const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
            console.log(`Listening on ${bind}`);
        });
    
    }).catch((err:any) => {
        console.error('Error creating redis connection', err);
    });

    
}).catch((err:any) => {
    console.error('Error creating mongo connection', err);
});


// sudo docker run -d -p 27017:27017 --name mongo_tests mongo:latest
// db.auth("Admin", "myNewPassword","SCRAM-SHA-1",false)
// mongo "mongodb://Admin:${DBPASSWORD}@<host>:<port>/admin?authSource=admin"
// dc run --name redis-tests -d -p 6379:6379 redis


