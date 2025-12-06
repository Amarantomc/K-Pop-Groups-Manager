import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class SongRoutes {
	private router: Router;
	private songController: SongController;

	constructor() {
		this.router = Router();
		this.songController = container.get<SongController>(Types.SongController);
		this.setupRoutes();
	}

	private setupRoutes(): void {}

	public getRouter(): Router {
		return this.router;
	}
}
