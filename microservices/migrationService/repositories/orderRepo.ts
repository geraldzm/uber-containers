import app from "../app";
var _ = require('lodash');

export class OrderRepo {

    public saveUpdatedOrders(pOrderIds : string[]) {
        pOrderIds.forEach((i_orderId)=> {
            //Iterates over all orderIds given from producer and find the orders related to that orderId.
            app.locals.orderModel.findById(i_orderId)
            .then((order : any) => {
                if(order) this.migrateOrder(order);
            }).catch((err : any) => {
                console.log("Inside OrderRepo, finding order by Id:\n" + err)
            });
            //Find all histories related with the actual orderId
            app.locals.orderHistoryModel.find({orderId : i_orderId})
            .then((histories : any) => {
                this.migrateHistories(histories);
            }).catch((err : any) => {
                console.log("Inside OrderRepo, finding histories by orderId:\n" + err)
            });
        });
    }

    private migrateOrder(pOrder : any){
        //deletes the order from the prev country and insert it in the new one using the sharding
        pOrder.remove(async (err : any, removedOrder : any) => {
            if(err) console.log(err);
            else {
                const newOrder = await new app.locals.orderModel({ ...pOrder._doc }).save();
                //checks if save is successful (if we have data lost)
                if(_.isEqual(newOrder, removedOrder)) console.log("Data is lost on: " + removedOrder);
            }
        });
    }

    private migrateHistories(pHistories: any) {
        //Iterates over all histories link to the current order
        pHistories.forEach((history : any) => {
            //Remove the history and call back save in the new sharding when done
            history.remove(async (err : any, removedHistory : any) => {
                if(err) console.log(err);
                else {
                    const newHistory = await new app.locals.orderHistoryModel({ ...history._doc }).save();
                    //checks if save is successful (if we have data lost)
                    if(_.isEqual(newHistory, removedHistory)) console.log("Data is lost on: " + removedHistory);
                }
            });
        });
    }
}


