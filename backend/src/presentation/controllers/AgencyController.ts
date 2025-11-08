import { PrismaClient } from "../../generated/prisma";
import { CreateAgencyUseCase } from "../../application/usesCase/agency/CreateAgency";
import { GetAgencyUseCase } from "../../application/usesCase/agency/GetAgencyUseCase";
import { ListAgenciesUseCase } from "../../application/usesCase/agency/ListAgenciesUseCase";
import { UpdateAgencyUseCase } from "../../application/usesCase/agency/UpdateAgencyUseCase";
import { DeleteAgencyUseCase } from "../../application/usesCase/agency/DeleteAgencyUseCase";
import { UnitOfWork } from "../../infrastructure/PrismaUnitOfWork";
import { AgencyRepository } from "../../infrastructure/repositories/AgencyRepository";
import type { Request, Response } from "express";
import { CreateAgencyDTO } from "../../application/dtos/agency/CreateAgencyDTO";

export class AgencyController {
	private createUseCase: CreateAgencyUseCase;
	private getUseCase: GetAgencyUseCase;
	private listUseCase: ListAgenciesUseCase;
	private updateUseCase: UpdateAgencyUseCase;
	private deleteUseCase: DeleteAgencyUseCase;

	constructor() {
		const prisma = new PrismaClient();
		const unitOfWork = new UnitOfWork(prisma as any);
		const repo = new AgencyRepository(prisma as any, unitOfWork as any);

		this.createUseCase = new CreateAgencyUseCase(repo, unitOfWork);
		this.getUseCase = new GetAgencyUseCase(repo);
		this.listUseCase = new ListAgenciesUseCase(repo);
		this.updateUseCase = new UpdateAgencyUseCase(repo, unitOfWork);
		this.deleteUseCase = new DeleteAgencyUseCase(repo, unitOfWork);
	}

	async createAgency(req: Request, res: Response) {
		try {
			const body = req.body;
			const dto = CreateAgencyDTO.create(body);
			const created = await this.createUseCase.execute(dto);
			res.status(201).json({ success: true, data: created });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async getAgency(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const agency = await this.getUseCase.execute(id!);
			res.json({ success: true, data: agency });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	async listAgencies(req: Request, res: Response) {
		try {
			const agencies = await this.listUseCase.execute();
			res.json({ success: true, data: agencies });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	async updateAgency(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const payload = req.body;
			const updated = await this.updateUseCase.execute(id!, payload);
			res.json({ success: true, data: updated });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async deleteAgency(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.deleteUseCase.execute(id!);
			res.json({ success: true });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}
