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

    public createContainers(containers:any[]): Promise<any> {

        const containersModel:any[] = [];

        containers.forEach((c) => {
            const totalVolum = c.xDim * c.yDim * c.zDim;
            containersModel.push(new app.locals.containerModel({
                currentCountry: c.currentCountry,
                destCountry: c.destCountry,

                shipId: c.shipId,

                // total dimentions
                xDim: c.xDim,
                yDim: c.yDim,
                zDim: c.zDim,

                // avalilable dimentions
                totalVolum: totalVolum,
                avalVolum: totalVolum,
                totalKg: c.maxKg,
                avalKg: c.maxKg
             }));
        });

        return app.locals.containerModel.insertMany(containersModel);
    }

    public createOrder(container:any, userId:string, dimensions:number[], volum:number, kg:number): Promise<any> {
        return new app.locals.orderModel({
            userId: userId,
            containerId:container._id,
            shipId: container.shipId,

            orgCountry: container.currentCountry,
            destCountry: container.destCountry,

            currentCountry: container.currentCountry,

            xDim: dimensions[0],
            yDim: dimensions[1],
            zDim: dimensions[2],

            volume: volum,
            kg: kg,

            price: 10 * kg
        }).save();
    }

    public createOrderHistory(orderId:string, status:string, currentCountry:string): Promise<any> {
        return new app.locals.orderHistoryModel({
            orderId: orderId,
            status: status,
            currentCountry : currentCountry,
        }).save();
    }

    public buySpace(containerId:string, userId:string, dimensions:number[], kg:number): Promise<any> {
        
        // try to lock container

        // when locked:
        return app.locals.containerModel
        .findById(containerId)
        .then((container: any) => {
       
            if(!container) throw new Error("container was not found");

            const volum:number = dimensions.reduce((a:number,b:number) => a*b);

            if(volum > container.avalVolum || kg > container.avalKg) 
                throw new Error("space does not fit in the container");

            // NEW kg and dimensions
            container.avalVolum -= volum;
            container.avalKg -= kg;

            // update container and insert order
            return app.locals.containerModel
            .findByIdAndUpdate(containerId, container)
            .then(() => this.createOrder(container, userId, dimensions, volum, kg)
                .then((order:any) => {
                    this.createOrderHistory(order._id, "created", container.currentCountry);
                })
            );
        });
            
    }
    
}
