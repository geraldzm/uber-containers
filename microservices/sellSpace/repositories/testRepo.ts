// import { Logger } from '../common'
import app from "../app";


export class TestRepo {

    // private log: Logger;

    public constructor() {
        // this.log = new Logger();
    }

    public getAllTest(): Promise<any> {
        
        return app.locals.redis.get('getAllTest')
        .then((value: any) => {
        
            if( value ) return value;
        
            return app.locals.mongo.connection.db.collection("spaces").find().toArray()
            .then( (arr: any) => {
                    app.locals.redis.set('getAllTest', arr);
                    return arr;
            });
            

        });

    }

}
