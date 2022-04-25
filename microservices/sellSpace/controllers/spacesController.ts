import { SpacesRepo } from "../repositories";

export class SpacesController {
  private static instance: SpacesController;
  private rep: SpacesRepo;

  private constructor() {
    this.rep = new SpacesRepo();
  }

  public static getInstance(): SpacesController {
    if (!this.instance) {
      this.instance = new SpacesController();
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

  public createContainers(containers: any[]): Promise<any> {
    return this.rep.createContainers(containers);
  }

  public buySpace(containerId: any, sellInformation: any): Promise<any> {
    
    if (
        !containerId ||
        !sellInformation.userId ||
        !sellInformation.dimensions ||
        sellInformation.dimensions.length != 3
      )
        throw new Error("no container found");

    return this.rep.buySpace(containerId, sellInformation.userId, sellInformation.dimensions);
  }
}
