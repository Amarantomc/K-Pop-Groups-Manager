// ActivityRoutes.ts
import { Router } from "express";
import type { ActivityController } from "../controllers/ActivityController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export class ActivityRoutes {
  private router: Router;
  private activityController: ActivityController;

  constructor() {
    this.router = Router();
    this.activityController = container.get<ActivityController>(Types.ActivityController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(AuthMiddleware.authenticate());

    
    this.router.post('/', RoleMiddleware.onlyStaff(), (req, res) => this.activityController.createActivity(req, res));
    
    this.router.get('/', (req, res) => this.activityController.getAll(req, res));
    
    this.router.get('/:apprenticeId&:groupId',(req,res)=> this.activityController.findByArtist(req,res))
    this.router.get('/:id', (req, res) => this.activityController.findById(req, res));
    
    this.router.put('/:id', RoleMiddleware.onlyStaff(), (req, res) => this.activityController.updateActivity(req, res));
    
    this.router.delete('/:id', RoleMiddleware.onlyStaff(), (req, res) => this.activityController.deleteActivity(req, res));

    this.router.post('/addArtist',RoleMiddleware.onlyStaff(),(req,res)=> this.activityController.addArtist(req,res))

    
  }

  public getRouter(): Router {
    return this.router;
  }
}