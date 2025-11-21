import { Router } from "express";
import type { ArtistController } from "../controllers/ArtistController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

    export class ArtistRoutes{
        private router: Router;
        private artistController: ArtistController;
  

  constructor() {
    this.router = Router();
    this.artistController =container.get<ArtistController>(Types.ArtistController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/', (req, res) => this.artistController.createArtist(req, res))
    this.router.get('/:id', (req, res) => this.artistController.findById(req,res))
    this.router.put('/:id', (req, res) => this.artistController.updateArtist(req, res))
    this.router.delete('/:id',(req, res) => this.artistController.deleteArtist(req, res))
    //this.router.get('/',(req, res) => this.artistController.(req, res))
   
  }

  public getRouter(): Router {
    return this.router;
  }
    }