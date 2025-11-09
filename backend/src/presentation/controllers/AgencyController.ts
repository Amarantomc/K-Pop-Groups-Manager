import { PrismaClient } from "../../generated/prisma";
import { CreateAgencyUseCase } from "../../application/usesCase/agency/CreateAgencyUseCase";
import { GetAgencyUseCase } from "../../application/usesCase/agency/GetAgencyUseCase";
import { ListAgenciesUseCase } from "../../application/usesCase/agency/ListAgenciesUseCase";
import { UpdateAgencyUseCase } from "../../application/usesCase/agency/UpdateAgencyUseCase";
import { DeleteAgencyUseCase } from "../../application/usesCase/agency/DeleteAgencyUseCase";
import { FindAgenciesByNameUseCase } from "../../application/usesCase/agency/FindAgenciesByNameUseCase";
import { FindAgenciesByAddressUseCase } from "../../application/usesCase/agency/FindAgenciesByAddressUseCase";
import { FindAgenciesByFoundationUseCase } from "../../application/usesCase/agency/FindAgenciesByFoundationUseCase";
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
	private findByNameUseCase: FindAgenciesByNameUseCase;
	private findByAddressUseCase: FindAgenciesByAddressUseCase;
	private findByFoundationUseCase: FindAgenciesByFoundationUseCase;

	constructor() {
		const prisma = new PrismaClient();
		const unitOfWork = new UnitOfWork(prisma as any);
		const repo = new AgencyRepository(prisma as any, unitOfWork as any);

		this.createUseCase = new CreateAgencyUseCase(repo, unitOfWork);
		this.getUseCase = new GetAgencyUseCase(repo);
		this.listUseCase = new ListAgenciesUseCase(repo);
		this.updateUseCase = new UpdateAgencyUseCase(repo, unitOfWork);
		this.deleteUseCase = new DeleteAgencyUseCase(repo, unitOfWork);
		this.findByNameUseCase = new FindAgenciesByNameUseCase(repo);
		this.findByAddressUseCase = new FindAgenciesByAddressUseCase(repo);
		this.findByFoundationUseCase = new FindAgenciesByFoundationUseCase(repo);
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

	async findAgenciesByName(req: Request, res: Response) {
		try {
			const { name } = req.query;
			if (!name || typeof name !== "string") {
				throw new Error("Name parameter is required");
			}
			const agencies = await this.findByNameUseCase.execute(name);
			res.json({ success: true, data: agencies });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findAgenciesByAddress(req: Request, res: Response) {
		try {
			const { address } = req.query;
			if (!address || typeof address !== "string") {
				throw new Error("Address parameter is required");
			}
			const agencies = await this.findByAddressUseCase.execute(address);
			res.json({ success: true, data: agencies });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findAgenciesByFoundation(req: Request, res: Response) {
		try {
			const { foundation } = req.query;
			if (!foundation || typeof foundation !== "string") {
				throw new Error("Foundation date parameter is required");
			}
			const date = new Date(foundation);
			if (isNaN(date.getTime())) {
				throw new Error("Invalid date format");
			}
			const agencies = await this.findByFoundationUseCase.execute(date);
			res.json({ success: true, data: agencies });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}
