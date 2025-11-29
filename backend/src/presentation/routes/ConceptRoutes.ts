import { Router } from "express";
import type { ConceptController } from "../controllers/ConceptController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class ConceptRoutes{
    private router: Router;
    private conceptController: ConceptController;
  

  constructor() {
    this.router = Router();
    this.conceptController =container.get<ConceptController>(Types.ConceptController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/', (req, res) => this.conceptController.createConcept(req, res))
    this.router.get('/:id', (req, res) => this.conceptController.getConcept(req,res))
    this.router.put('/:id', (req, res) => this.conceptController.updateConcept(req, res))
    this.router.delete('/:id',(req, res) => this.conceptController.deleteConcept(req, res))
    this.router.get('/:name',(req, res) => this.conceptController.listConcept(req, res))
  }

  public getRouter(): Router {
    return this.router;
  }
}