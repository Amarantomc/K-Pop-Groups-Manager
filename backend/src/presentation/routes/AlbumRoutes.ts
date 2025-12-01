import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class AlbumRoutes {
	private router: Router;
	private albumController: AlbumController;

	constructor() {
		this.router = Router();
		this.albumController = container.get<AlbumController>(
			Types.AlbumController
		);
		this.setupRoutes();
	}

	private setupRoutes(): void {
		this.router.post("/", (req, res) =>
			this.albumController.createAlbum(req, res)
		);
		this.router.get("/", (req, res) =>
			this.albumController.getAlbums(req, res)
		);
		this.router.get("/:id", (req, res) =>
			this.albumController.getAlbum(req, res)
		);
		this.router.put("/:id", (req, res) =>
			this.albumController.updateAlbum(req, res)
		);
		this.router.delete("/:id", (req, res) =>
			this.albumController.deleteAlbum(req, res)
		);
		this.router.get("/:title", (req, res) =>
			this.albumController.findAlbumByTitle(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}
