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
    //this.router.get('/:id', (req, res) => this.conceptController.getConcept(req,res))
    //this.router.put('/:id', (req, res) => this.conceptController.updateConcept(req, res))
    //this.router.delete('/:id',(req, res) => this.conceptController.deleteConcept(req, res))
    //this.router.get('/',(req, res) => this.conceptController.listConcept(req, res))
  }

  public getRouter(): Router {
    return this.router;
  }
}