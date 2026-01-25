import { Router } from "express";
import type { ApprenticeController } from "../controllers/ApprenticeController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export class ApprenticeRoutes{
    private router: Router;
    private apprenticeController: ApprenticeController;
  

  constructor() {
    this.router = Router();
    this.apprenticeController =container.get<ApprenticeController>(Types.ApprenticeController)
    this.setupRoutes();
  }
  
  private setupRoutes(): void {


    //this.router.use(AuthMiddleware.authenticate())


    this.router.get("/:id/evaluations",
       (req, res) => this.apprenticeController.getAllEvaluations(req, res)
      );

    this.router.put(
      '/attract/:apprenticeId/:agencyId',
      //RoleMiddleware.onlyStaff(),
      (req, res) => this.apprenticeController.attractApprentice(req, res)
    );

    this.router.get('/scout',
      (req, res) => this.apprenticeController.apprenticeScout(req, res)
    );
  
    this.router.get('/agency/:id',
      (req, res) => this.apprenticeController.listByAgency(req,res)
    );
  
    this.router.get('/name/:name',
      (req, res) => this.apprenticeController.getByNameApprentice(req,res)
    );
  
    this.router.post('/evaluation',
      (req, res) => this.apprenticeController.addEvaluation(req, res)
    );
  
    this.router.post('/:id',
      RoleMiddleware.onlyStaff(),
      (req, res) => this.apprenticeController.createApprentice(req, res)
    );
  
    this.router.put('/:id',
      RoleMiddleware.onlyStaff(),
      (req, res) => this.apprenticeController.updateApprentice(req, res)
    );
  
    this.router.delete('/:id',
      RoleMiddleware.onlyStaff(),
      (req, res) => this.apprenticeController.deleteApprentice(req, res)
    );
  
    this.router.get('/:id',
      (req, res) => this.apprenticeController.getApprentice(req,res)
    );
  
    this.router.get('/',
      (req, res) => this.apprenticeController.listApprentice(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}