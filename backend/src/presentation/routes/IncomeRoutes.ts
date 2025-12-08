import { Router } from "express";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import type { IncomeController } from "../controllers/IncomeController";

export class IncomeRoutes{
    private router: Router;
    private incomeController: IncomeController;
  

  constructor() {
    this.router = Router();
    this.incomeController = container.get<IncomeController>(Types.IncomeController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/', (req, res) => this.incomeController.createIncome(req, res))
    this.router.get('/:id', (req, res) => this.incomeController.getIncome(req,res))
    this.router.put('/:id', (req, res) => this.incomeController.updateIncome(req, res))
    this.router.delete('/:id',(req, res) => this.incomeController.deleteIncome(req, res))
    this.router.get('/',(req, res) => this.incomeController.listIncome(req, res))
  }

  public getRouter(): Router {
    return this.router;
  }
}