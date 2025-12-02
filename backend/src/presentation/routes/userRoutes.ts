import  { Router } from "express";
import  { UserController } from "../controllers/UserController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
 

export class UserRoutes {
  private router: Router;
  private userController: UserController;
  

  constructor() {
    this.router = Router();
    this.userController =container.get<UserController>(Types.UserController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(AuthMiddleware.authenticate())
    this.router.post('/',RoleMiddleware.onlyAdmin(), (req, res) => this.userController.createUser(req, res))
    this.router.get('/',RoleMiddleware.onlyAdmin(),(req,res)=>this.userController.getUsers(req,res))
    this.router.get('/:id',RoleMiddleware.onlyAdmin(),(req,res)=>this.userController.getUser(req,res))
    //Cambiar por check de token.user.id==id
    this.router.put('/:id',RoleMiddleware.updatePropertiesId(),(req, res) => this.userController.updateUser(req, res))
    this.router.delete('/:id',RoleMiddleware.onlyAdmin(), (req, res) => this.userController.deleteUser(req, res))
    

   
  }

  public getRouter(): Router {
    return this.router;
  }
}