import { Router } from "express";
import { GroupController } from "../controllers/GroupController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class GroupRoutes {
	private router: Router;
	private groupController: GroupController;

	constructor() {
		this.router = Router();
		this.groupController = container.get<GroupController>(
			Types.GroupController
		);
		this.setupRoutes();
	}

	private setupRoutes(): void {
		// CRUD básico
		this.router.post("/", (req, res) =>
			this.groupController.createGroup(req, res)
		);
		this.router.get("/", (req, res) =>
			this.groupController.listGroups(req, res)
		);

		// Búsquedas avanzadas (FindBy) - ANTES de /:id para evitar conflictos
		this.router.get("/search/name", (req, res) =>
			this.groupController.findGroupByName(req, res)
		);
		this.router.get("/search/debut", (req, res) =>
			this.groupController.findGroupByDebut(req, res)
		);
		this.router.get("/search/status", (req, res) =>
			this.groupController.findGroupsByStatus(req, res)
		);
		this.router.get("/search/membercount", (req, res) =>
			this.groupController.findGroupsByMemberCount(req, res)
		);
		this.router.get("/search/member", (req, res) =>
			this.groupController.findGroupsByMember(req, res)
		);
		this.router.get("/search/agency", (req, res) =>
			this.groupController.findGroupsByAgency(req, res)
		);
		this.router.get("/search/concept", (req, res) =>
			this.groupController.findGroupsByConcept(req, res)
		);
		this.router.get("/search/visualconcept", (req, res) =>
			this.groupController.findGroupByVisualConcept(req, res)
		);

		// CRUD por ID
		this.router.get("/:id", (req, res) =>
			this.groupController.getGroup(req, res)
		);
		this.router.put("/update/:id", (req, res) =>
			this.groupController.updateGroup(req, res)
		);
		this.router.delete("/delete/:id", (req, res) =>
			this.groupController.deleteGroup(req, res)
		);

		// Relaciones múltiples
		this.router.post("/:id/members/add", (req, res) =>
			this.groupController.addMembers(req, res)
		);
		this.router.post("/:id/members/remove", (req, res) =>
			this.groupController.removeMembers(req, res)
		);
		this.router.post("/:id/albums/add", (req, res) =>
			this.groupController.addAlbums(req, res)
		);
		this.router.post("/:id/activities/add", (req, res) =>
			this.groupController.addActivities(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}
