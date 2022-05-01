import express = require('express');
import { ContainerController } from '../controllers'

const app = express();
const controller = ContainerController.getInstance();

app.get("/getAvailableSpaces", (req:any, res:any, next:any) => {

    controller.getAllSpacesByCountry(req.query['country'], req.query['destinationCountry'])
    .then((data : any) => {
        res.json(data);
    })
    .catch((err: any)=>{
        console.error(err);
        res.sendStatus(500); // internal error
    });

});

app.post("/buySpace", (req:any, res:any, next:any) => {

    controller.buySpace(req.body['containerId'], req.body['sellInformation'])
    .then((data) => {
        res.json(data);
    })
    .catch((err: any)=>{
        console.error(err);
        res.sendStatus(500); // internal error
    });

});

app.post("/createContainers", (req:any, res:any, next:any) => {

    controller.createContainers(req.body['containers'])
    .then(() => {
        res.sendStatus(200);
    })
    .catch((err: any)=>{
        console.error(err);
        res.sendStatus(500); // internal error
    });

});


export { app as spacesrouter };