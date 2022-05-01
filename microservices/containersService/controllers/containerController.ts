import { ContainerRepo } from "../repositories";

export class ContainerController {
  private static instance: ContainerController;
  private rep: ContainerRepo;

  private constructor() {
    this.rep = new ContainerRepo();
  }

  public static getInstance(): ContainerController {
    if (!this.instance) {
      this.instance = new ContainerController();
    }
    return this.instance;
  }

  public getAllSpacesByCountry(
    country: string,
    destCountry: string
  ): Promise<any> {
    if (country && destCountry)
      return this.rep.getAllSapcesByCountry(country, destCountry);

    return new Promise((rs, rj) => rj("no country provided"));
  }

  public getOrdersByUserId(userId:string): Promise<any> {
    return this.rep.getOrdersByUserId(userId);
  }
  
  public getOrderById(orderId:string): Promise<any> {
    return this.rep.getOrdersById(orderId);
  }

  public createContainers(containers: any[]): Promise<any> {
    return this.rep.createContainers(containers);
  }

  public buySpace(containerId: any, sellInformation: any): Promise<any> {
    
    if (
        !containerId ||
        !sellInformation.userId ||
        !sellInformation.dimensions ||
        !sellInformation.kg ||
        sellInformation.dimensions.length != 3
      )
        throw new Error("no container found");

    return this.rep.buySpace(containerId, sellInformation.userId, sellInformation.dimensions, sellInformation.kg);
  }
}
