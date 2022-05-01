import app from "../app";

export class ContainerRepo {

    public getAllSapcesByCountry(country:string, destCountry:string): Promise<any> {
        
        const key = 'getAllSapcesByCountry'+country+destCountry;

        return app.locals.redis.get(key)
        .then((value: any) => {
        
            if( value ) return JSON.parse(value);

            return app.locals.containerModel
            .find({country: country, destCountry: destCountry} )
            .then( (arr: any) => {
                
                app.locals.redis
                    .set(key, JSON.stringify(arr), { EX:10 });

                    return arr;
            });
        });

    }

    public getOrdersByUser(userId:string): Promise<any> {
        
        const key = 'getOrdersByUser'+userId;

        return app.locals.redis.get(key)
        .then((value: any) => {
        
            if( value ) return JSON.parse(value);

            return app.locals.containerModel
            .find({country: country, destCountry: destCountry} )
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

    public buySpace(containerId:string, userId:string, dimensions:number[]): Promise<any> {
        
        // try to lock container

        // when locked:
        return app.locals.containerModel
        .findById(containerId)
        .then((container: any) => {
       
            if(!container) throw new Error("container was not found");

            var contDimensions =  [container.xADim, container.yADim, container.zADim].sort();
            dimensions.sort();

            const x = contDimensions[0] - dimensions[0];
            const y = contDimensions[1] - dimensions[1];
            const z = contDimensions[2] - dimensions[2];

            if(x < 0 || y < 0 || z < 0) 
                throw new Error("space does not fit in the container");

            // NEW avalilable dimentions
            // order is not important
            container.xADim = x;
            container.yADim = y;
            container.zADim = z;

            // update container and insert order
            return app.locals.containerModel
            .findByIdAndUpdate(containerId, container)
            .then(() => 
                new app.locals.orderModel({
                    userId: userId,
                    containerId:containerId,
    
                    shipId: container.shipId,

                    orgCountry: container.country,
                    destCountry: container.destCountry,
    
                    currentCountry: container.country,

                    xDim: dimensions[0],
                    yDim: dimensions[1],
                    zDim: dimensions[2],
    
                    price: 100
                }).save()
            );
        });
            
    }
    
}
