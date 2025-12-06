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

	private setupRoutes(): void {
		this.router.post("/", (req, res) =>
			this.songController.createSong(req, res)
		);
		this.router.get("/", (req, res) => this.songController.getSongs(req, res));
		this.router.get("/:id", (req, res) =>
			this.songController.getSong(req, res)
		);
		this.router.put("/:id", (req, res) =>
			this.songController.updateSong(req, res)
		);
		this.router.delete("/:id", (req, res) =>
			this.songController.deleteSong(req, res)
		);
		this.router.get("/search/:title", (req, res) =>
			this.songController.findSongByTitle(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}
