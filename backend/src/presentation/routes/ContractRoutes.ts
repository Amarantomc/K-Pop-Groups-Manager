import   { Router } from "express";
import   { ConceptController } from "../controllers/ConceptController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import type { ContractController } from "../controllers/ContractController";

export class ContractRoutes{
    private router: Router;
    private contractController: ContractController;
  

  constructor() {
    this.router = Router();
    this.contractController =container.get<ContractController>(Types.ContractController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     //Añadir Roles
    this.router.post('/', (req, res) => this.contractController.createContract(req, res))
    this.router.get('/', (req, res) => this.contractController.getAll(req,res))
    this.router.put('/', (req, res) => this.contractController.update(req, res))
    this.router.delete('/',(req, res) => this.contractController.delete(req, res))
    this.router.get('/find',(req, res) => this.contractController.findById(req, res))
  }

  public getRouter(): Router {
    return this.router;
  }
}