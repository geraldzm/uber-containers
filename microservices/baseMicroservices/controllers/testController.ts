import { TestRepo } from '../repositories';

export class TestController {
    
    private static instance: TestController;
    private rep: TestRepo;

    private constructor()
    {
        // this.log = new Logger();
        this.rep = new TestRepo();
    }

    public static getInstance() : TestController
    {
        if (!this.instance)
        {
            this.instance = new TestController();
        }
        return this.instance;
    }

    public testController() : Promise<any> 
    {
        return this.rep.getAllTest();
    }

}