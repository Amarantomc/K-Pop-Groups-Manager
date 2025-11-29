import { Router } from "express";
import type { ArtistController } from "../controllers/ArtistController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

    export class ArtistRoutes{
        private router: Router;
        private artistController: ArtistController;
  

  constructor() {
    this.router = Router();
    this.artistController =container.get<ArtistController>(Types.ArtistController)
    this.setupRoutes();
  }

  private setupRoutes(): void {

    this.router.use(AuthMiddleware.authenticate());
    this.router.post('/',RoleMiddleware.onlyManager(), (req, res) => this.artistController.createArtist(req, res))
    this.router.get('/:apprenticeId&:groupId', (req, res) => this.artistController.findById(req,res))
    this.router.put('/:apprenticeId&:groupId', (req, res) => this.artistController.updateArtist(req, res))
    this.router.delete('/:apprenticeId&:groupId',(req, res) => this.artistController.deleteArtist(req, res))
    this.router.get('/',RoleMiddleware.requireAgencyAccess,(req, res) => this.artistController.getAll(req, res))
    this.router.get('/:id', (req, res) => this.artistController.getArtistsByAgency(req, res));
   
  }

  public getRouter(): Router {
    return this.router;
  }
    }