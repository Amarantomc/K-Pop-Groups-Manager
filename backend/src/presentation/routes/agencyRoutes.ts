import { Router } from "express";
import { AgencyController } from "../controllers/AgencyController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";

export class AgencyRoutes {
	private router: Router;
	private agencyController: AgencyController;

	constructor() {
		this.router = Router();
		this.agencyController = container.get<AgencyController>(Types.AgencyController)
		this.setupRoutes();
	}

	private setupRoutes(): void {
		this.router.post("/", (req, res) =>this.agencyController.createAgency(req, res));
		this.router.get("/", (req, res) =>this.agencyController.listAgencies(req, res));
		this.router.get("/:id", (req, res) =>this.agencyController.getAgency(req, res));
		this.router.put("/:id", (req, res) =>this.agencyController.updateAgency(req, res));
		this.router.delete("/:id", (req, res) =>this.agencyController.deleteAgency(req, res));
		this.router.get("/search/agency_name", (req, res) =>this.agencyController.findAgenciesByName(req, res));
		this.router.get("/search/agency_address", (req, res) =>this.agencyController.findAgenciesByAddress(req, res));
		this.router.get("/search/agency_foundation", (req, res) =>this.agencyController.findAgenciesByFoundation(req, res));
	}

	public getRouter(): Router {
		return this.router;
	}
}
