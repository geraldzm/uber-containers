import { Console } from 'console';
import express = require('express');
import { TestController } from '../controllers'

const app = express();

app.get("/getArticles", (req:any, res:any, next:any) => {

    TestController.getInstance().testController()
    .then((data : any) => {
        res.json(data);
    })
    .catch((err: any)=>{
        console.error(err);
        res.sendStatus(500); // internal error
    });

});

export { app as consultrouter };