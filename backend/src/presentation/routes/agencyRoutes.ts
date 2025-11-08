import { Router } from "express";
import { AgencyController } from "../controllers/AgencyController";

const router = Router();
const controller = new AgencyController();

router.post("/", (req, res) => controller.createAgency(req, res));
router.get("/", (req, res) => controller.listAgencies(req, res));
router.get("/:id", (req, res) => controller.getAgency(req, res));
router.put("/:id", (req, res) => controller.updateAgency(req, res));
router.delete("/:id", (req, res) => controller.deleteAgency(req, res));

export default router;
