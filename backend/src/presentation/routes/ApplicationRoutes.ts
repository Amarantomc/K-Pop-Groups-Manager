import { Router } from "express";
import type { ApplicationController } from "../controllers/ApplicationController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export class ApplicationRoutes{
    private router: Router;
    private applicationController: ApplicationController;
  

  constructor() {
    this.router = Router();
    this.applicationController =container.get<ApplicationController>(Types.ApplicationController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.use(AuthMiddleware.authenticate())
    this.router.post('/:id',RoleMiddleware.onlyStaff(), (req, res) => this.applicationController.createApplication(req, res))
    this.router.get('/:id', (req, res) => this.applicationController.getApplication(req,res))
    this.router.put('/:id',RoleMiddleware.onlyStaff(),(req, res) => this.applicationController.updateApplication(req, res))
    this.router.delete('/:id',RoleMiddleware.onlyStaff(),(req, res) => this.applicationController.deleteApplication(req, res))
    this.router.get('/',(req, res) => this.applicationController.listApplication(req, res))
    
  }

  public getRouter(): Router {
    return this.router;
  }
}