import { Router } from "express";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import type { PopularityListController } from "../controllers/PopularityListController";

export class PopularityListRoutes{
    private router: Router;
    private popularityListController: PopularityListController;
  

  constructor() {
    this.router = Router();
    this.popularityListController =container.get<PopularityListController>(Types.PopularityListController)
    this.setupRoutes();
  }

  private setupRoutes(): void {
     
    this.router.post('/', (req, res) => this.popularityListController.createPopularityList(req, res))
    this.router.get('/:id', (req, res) => this.popularityListController.getPopularityList(req,res))
    this.router.put('/:id', (req, res) => this.popularityListController.updatePopularityList(req, res))
    this.router.delete('/:id',(req, res) => this.popularityListController.deletePopularityList(req, res))
    this.router.get('/',(req, res) => this.popularityListController.listPopularityList(req, res))
    this.router.post('/addSong',(req, res) => this.popularityListController.addSongToPopularityPopularityList(req, res))


  }

  public getRouter(): Router {
    return this.router;
  }
}