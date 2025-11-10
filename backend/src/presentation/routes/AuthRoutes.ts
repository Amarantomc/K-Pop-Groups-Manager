import  { Router } from "express";
import type { AuthController } from "../controllers/AuthController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class AuthRoutes{
    private router: Router;
    private authController: AuthController;
  

  constructor() {
    this.router = Router();
    this.authController =container.get<AuthController>(Types.AuthController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/login', (req, res) => this.authController.login(req, res))
    //this.router.get('/me',(req,res)=>this.authController.me(req,res))
   
  }

  public getRouter(): Router {
    return this.router;
  }
}