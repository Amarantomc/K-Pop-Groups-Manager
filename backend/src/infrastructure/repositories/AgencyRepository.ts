import { Agency } from "../../domain/entities/Agency";
import { CreateAgencyDTO } from "../../application/dtos/agency/CreateAgencyDTO";
import { AgencyResponseDTO } from "../../application/dtos/agency/AgencyResponseDTO";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IAgencyRepository } from "../../application/interfaces/repositories/IAgencyRepository";

// Note: Prisma model is 'Agencia' (in schema.prisma). The generated client exposes
// `prisma.agencia`. The DB fields are named (nombre, ubicacion, fechaFundacion),
// while our domain uses (name, address, foundation). Repository maps between them.
export class AgencyRepository implements IAgencyRepository {
	constructor(private prisma: any, private unitOfWork: UnitOfWork) {}

	private get db() {
		return this.unitOfWork.getTransaction();
	}

	private mapPrismaToDomain(raw: any): Agency {
		if (!raw) return raw;
		// map DB names to domain names
		const mapped = {
			id: raw.id,
			name: raw.nombre,
			address: raw.ubicacion,
			foundation: raw.fechaFundacion,
		};
		return AgencyResponseDTO.toEntity(mapped);
	}

	async create(data: CreateAgencyDTO): Promise<Agency> {
		const agency = await this.db.agencia.create({
			data: {
				nombre: data.name,
				ubicacion: data.address,
				fechaFundacion: data.foundation,
			},
		});

		return this.mapPrismaToDomain(agency);
	}

	async findById(id: any): Promise<Agency | null> {
		id = Number(id);
		const agency = await this.db.agencia.findUnique({ where: { id } });
		return agency ? this.mapPrismaToDomain(agency) : null;
	}

	async findByName(name: string): Promise<Agency[]> {
		const list = await this.db.agencia.findMany({ where: { nombre: name } });
		return list.map((r: any) => this.mapPrismaToDomain(r));
	}

	async findByAddress(address: string): Promise<Agency[]> {
		const list = await this.db.agencia.findMany({
			where: { ubicacion: address },
		});
		return list.map((r: any) => this.mapPrismaToDomain(r));
	}

	async findByFoundation(foundation: Date): Promise<Agency[]> {
		const list = await this.db.agencia.findMany({
			where: { fechaFundacion: foundation },
		});
		return list.map((r: any) => this.mapPrismaToDomain(r));
	}

	async findAll(): Promise<Agency[]> {
		const list = await this.db.agencia.findMany();
		return list.map((r: any) => this.mapPrismaToDomain(r));
	}

	async update(id: string, data: any): Promise<Agency> {
		const numericId = Number(id);
		const payload: any = {};
		if (data.name !== undefined) payload.nombre = data.name;
		if (data.address !== undefined) payload.ubicacion = data.address;
		if (data.foundation !== undefined) payload.fechaFundacion = data.foundation;

		const updated = await this.db.agencia.update({
			where: { id: numericId },
			data: payload,
		});

		return this.mapPrismaToDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const numericId = Number(id);
		await this.db.agencia.delete({ where: { id: numericId } });
	}
}
