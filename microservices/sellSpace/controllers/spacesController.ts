import { SpacesRepo } from '../repositories';

export class SpacesController {
    
    private static instance: SpacesController;
    private rep: SpacesRepo;

    private constructor()
    {
        // this.log = new Logger();
        this.rep = new SpacesRepo();
    }

    public static getInstance() : SpacesController
    {
        if (!this.instance)
        {
            this.instance = new SpacesController();
        }
        return this.instance;
    }

    public getAllSpacesByCountry(country:string) : Promise<any> 
    {
        if(country) return this.rep.getAllSapcesByCountry(country);
        return new Promise((rs, rj) => rj("no country provided"));
    }

    public createContainers(containers:any[]) : Promise<any> 
    {

        console.log("containers");
        console.log(containers);

        return this.rep.createContainers(containers);
    }

}