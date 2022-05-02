import app from "../app";
import { orderModel, orderHistoryModel } from '../model/models'

export class OrderRepo {

    /*
    Entonces el consumer lo recibe y hace un insert en la base de datos de orders con el nuevo pais,
    asi se mueve geograficamente gracias al sharding por tags.

    Tambien inserta en la base de datos de actualizaciones.

    Por shipId, traigo todos los Order
    foreach itera en orders (currentOrder) y trae todos los orderHistory relacionados a ese currentOrder
    El producer crea el modelo UserHistory
    */
    public saveUpdatedOrder(shipId: string) : Promise<any> {
        const ordersByShip = app.locals.orderModel().find({shipId: shipId});
        ordersByShip.forEach((order : any) => {
            const orderHistoriesByOrder = app.locals.orderHistoryModel().find({orderId: order._id});
            
        });
    }



}
