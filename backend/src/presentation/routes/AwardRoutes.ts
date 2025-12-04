import { Router } from "express";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import type { AwardController } from "../controllers/AwardController";

export class AwardRoutes{
    private router: Router;
    private awardController: AwardController;
  

  constructor() {
    this.router = Router();
    this.awardController =container.get<AwardController>(Types.AwardController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/', (req, res) => this.awardController.createAward(req, res))
    this.router.get('/:id', (req, res) => this.awardController.getAward(req,res))
    this.router.put('/:id', (req, res) => this.awardController.updateAward(req, res))
    this.router.delete('/:id',(req, res) => this.awardController.deleteAward(req, res))
    this.router.get('/',(req, res) => this.awardController.listAward(req, res))
  }

  public getRouter(): Router {
    return this.router;
  }
}