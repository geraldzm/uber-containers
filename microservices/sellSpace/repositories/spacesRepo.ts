import app from "../app";
import containerModel from "../model/models";

export class SpacesRepo {

    public getAllSapcesByCountry(country:string): Promise<any> {
        
        const key = 'getAllSapcesByCountry'+country;

        return app.locals.redis.get(key)
        .then((value: any) => {
        
            if( value ) return JSON.parse(value);
        
            return app.locals.mongo.connection.db
            .collection("spaces")
            .find({country: country}).toArray()
            .then( (arr: any) => {
                    app.locals.redis
                    .set(key, JSON.stringify(arr), { EX:10 });
                    return arr;
            });
        });

    }

    public createContainers(containers:any[]): Promise<any> {
        return app.locals.containerModel.insertMany(containers);
    }
    
}
