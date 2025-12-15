import { Router } from "express";
import type { ExportController } from "../controllers/ExportController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class ExportRoutes{
    private router: Router;
    private exportController: ExportController;
  

  constructor() {
    this.router = Router();
    this.exportController =container.get<ExportController>(Types.ExportController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.get('/artist/:id', (req, res) => this.exportController.exportArtistsPdf(req,res))
    this.router.get('/activities/:id', (req, res) => this.exportController.exportCalendarPdf(req,res))
    this.router.get('/artistOnDebut/:id', (req, res) => this.exportController.exportArtistsOnDebutPdf(req,res))
    this.router.get('/agencies/', (req, res) => this.exportController.exportAgenciesPdf(req,res))
    this.router.get('/apprentices/', (req, res) => this.exportController.exportApprenticesPdf(req,res))
    this.router.get('/groups/', (req, res) => this.exportController.exportGroupsPdf(req,res))
    this.router.get('/concepts/', (req, res) => this.exportController.exportConceptsPdf(req,res))
    this.router.get('/awards/', (req, res) => this.exportController.exportAwardsPdf(req,res))
    this.router.get('/songs/', (req, res) => this.exportController.exportSongsPdf(req,res))

 
  }

  public getRouter(): Router {
    return this.router;
  }
}