import { Router } from "express";
import type { ApprenticeController } from "../controllers/ApprenticeController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class ApprenticeRoutes{
    private router: Router;
    private apprenticeController: ApprenticeController;
  

  constructor() {
    this.router = Router();
    this.apprenticeController =container.get<ApprenticeController>(Types.ApprenticeController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/', (req, res) => this.apprenticeController.createApprentice(req, res))
    this.router.get('/:id', (req, res) => this.apprenticeController.getApprentice(req,res))
    this.router.put('/:id', (req, res) => this.apprenticeController.updateApprentice(req, res))
    this.router.delete('/:id',(req, res) => this.apprenticeController.deleteApprentice(req, res))
    this.router.get('/',(req, res) => this.apprenticeController.listApprentice(req, res))
    this.router.get('/:name', (req, res) => this.apprenticeController.getByNameApprentice(req,res))
    
  }

  public getRouter(): Router {
    return this.router;
  }
}