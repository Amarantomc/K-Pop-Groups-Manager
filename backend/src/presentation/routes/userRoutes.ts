import  { Router } from "express";
import  { UserController } from "../../presentation/controllers/UserController";
 

export class UserRoutes {
  private router: Router;
  private userController: UserController;
  

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', (req, res) => this.userController.createUser(req, res))
    this.router.get('/:id',(req,res)=>this.userController.getUser(req,res))
   
  }

  public getRouter(): Router {
    return this.router;
  }
}