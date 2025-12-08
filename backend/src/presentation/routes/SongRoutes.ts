import { Router } from "express";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import type { SongController } from "../controllers/SongController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export class SongRoutes {
  private router: Router;
  private controller: SongController;

  constructor() {
    this.router = Router();
    this.controller = container.get<SongController>(Types.SongController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    
 
 
this.router.post("/",  (req, res) =>this.controller.createSong(req, res));

//this.router.get("/", (req, res) =>this.controller.getAll(req, res));

this.router.get("/:id", (req, res) =>this.controller.findById(req, res));

//this.router.put("/:id", RoleMiddleware.onlyStaff(), (req, res) =>this.controller.updateSong(req, res));

this.router.delete("/:id",   (req, res) => this.controller.deleteSong(req, res));
 
  }

  public getRouter(): Router {
    return this.router;
  }
}