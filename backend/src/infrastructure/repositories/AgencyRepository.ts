import { Agency } from "../../domain/entities/Agency";
import { CreateAgencyDTO } from "../../application/dtos/agency/CreateAgencyDTO";
import { AgencyResponseDTO } from "../../application/dtos/agency/AgencyResponseDTO";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IAgencyRepository } from "../../application/interfaces/repositories/IAgencyRepository";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { Artist } from "../../domain/entities/Artist";
import type { Group } from "../../domain/entities/Group";
import { ArtistResponseDto } from "../../application/dtos/artist/ArtistResponseDto";
import { GroupResponseDTO } from '../../application/dtos/group/GroupResponseDTO';

// Note: Prisma model is 'Agencia' (in schema.prisma). The generated client exposes
// `prisma.agencia`. The DB fields are named (nombre, ubicacion, fechaFundacion),
// while our domain uses (name, address, foundation). Repository maps between them.

@injectable()
export class AgencyRepository implements IAgencyRepository {
	constructor(@inject(Types.PrismaClient) private prisma: any, 
	@inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork) {}

	private get db() {
		return this.unitOfWork.getTransaction();
	}



	async artistsWithActiveContracts(agencyId: number,date: Date | string): Promise<Artist[]> {
	  
		const targetDate = new Date(date);
	  
		const contratos = await this.db.contrato.findMany({
		  where: {
			idAg: agencyId,
			estado: "ACTIVO",
			fechaInicio: {
			  lte: targetDate,
			},
			OR: [
			  {
				fechaFinalizacion: null,
			  },
			  {
				fechaFinalizacion: {
				  gte: targetDate,
				},
			  },
			],
		  },
		  include: {
			Artista: {
			  include: {
				aprendiz: true,
				grupo: true,
			  },
			},
		  },
		});
	  
		// Evitar duplicados (un artista puede tener varios contratos activos)
		const artistMap = new Map<string, any>();
	  
		for (const contrato of contratos) {
		  if (contrato.Artista) {
			const key = `${contrato.Artista.idAp}-${contrato.Artista.idGr}`;
			artistMap.set(key, contrato.Artista);
		  }
		}
	  
		return ArtistResponseDto.toEntities(Array.from(artistMap.values()));
	  }

	  async groupsWithActiveContracts(agencyId: number,date: Date | string): Promise<Group[]> {
	  
		const targetDate = new Date(date);
	  
		const contratos = await this.db.contratoGrupo.findMany({
		  where: {
			idAg: agencyId,
			estado: "ACTIVO",
			fechaInicio: {
			  lte: targetDate,
			},
			OR: [
			  {
				fechaFinalizacion: null,
			  },
			  {
				fechaFinalizacion: {
				  gte: targetDate,
				},
			  },
			],
		  },
		  include: {
			Grupo: true,
		  },
		});
	  
		const groupMap = new Map<number, any>();
	  
		for (const contrato of contratos) {
		  if (contrato.Grupo) {
			groupMap.set(contrato.Grupo.id, contrato.Grupo);
		  }
		}
	  
		return GroupResponseDTO.toEntities(Array.from(groupMap.values()));
	  }

	async create(data: CreateAgencyDTO): Promise<Agency> {
		const agency = await this.db.agencia.create({
			data: {
				nombre: data.name,
				ubicacion: data.address,
				fechaFundacion: new Date(data.foundation),
			},
		});

		return AgencyResponseDTO.toEntity(agency);
	}

	async findById(id: any): Promise<Agency | null> {
		id = Number(id);
		const agency = await this.db.agencia.findUnique({ where: { id } });
		return agency ? AgencyResponseDTO.toEntity(agency) : null;
	}

	async findByName(name: string): Promise<Agency[]> {
		const list = await this.db.agencia.findMany({ where: { nombre: name } });
		return list.map((r: any) => AgencyResponseDTO.toEntity(r));
	}

	async findByAddress(address: string): Promise<Agency[]> {
		const list = await this.db.agencia.findMany({
			where: { ubicacion: address },
		});
		return list.map((r: any) => AgencyResponseDTO.toEntity(r));
	}

	async findByFoundation(foundation: Date): Promise<Agency[]> {
		const list = await this.db.agencia.findMany({
			where: { fechaFundacion: foundation },
		});
		return list.map((r: any) => AgencyResponseDTO.toEntity(r));
	}

	async findAll(): Promise<Agency[]> {
		const list = await this.db.agencia.findMany();
		return list.map((r: any) => AgencyResponseDTO.toEntity(r));
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

		return AgencyResponseDTO.toEntity(updated);
	}

	async delete(id: string): Promise<void> {
		const numericId = Number(id);
	
		const contratosArtistas = await this.db.contrato.findMany({
			where: { idAg: numericId },
			select: { idAp: true, idGr: true },
		});
	
		for (const contrato of contratosArtistas) {
			await this.db.artista.update({
				where: { idAp_idGr: { idAp: contrato.idAp, idGr: contrato.idGr } },
				data: { estadoArtista: "En Pausa" },
			});
		}
	
		const contratosGrupo = await this.db.contratoGrupo.findMany({
			where: { idAg: numericId },
			select: { IdGr: true },
		});
	
		for (const contrato of contratosGrupo) {
			await this.db.grupo.update({
				where: { id: contrato.IdGr },
				data: { estadoGrupo: "En Pausa" },
			});
		}
	
		const aprendices = await this.db.aprendizEnAgencia.findMany({
			where: { idAg: numericId },
			select: { idAp: true },
		});
	
		for (const aprendiz of aprendices) {
			await this.db.aprendiz.update({
				where: { id: aprendiz.idAp },
				data: { estadoAprendiz: "Proceso de Selección" },
			});
		}
	
		await this.db.aprendizEnAgencia.deleteMany({ where: { idAg: numericId } });
		await this.db.evaluacionAprendiz.deleteMany({ where: { idAg: numericId } });
		await this.db.aprendizSolicitaGrupo.deleteMany({ where: { idAg: numericId } });
		await this.db.artistaSolicitaGrupo.deleteMany({ where: { idAg: numericId } });
		await this.db.contrato.deleteMany({ where: { idAg: numericId } });
		await this.db.contratoGrupo.deleteMany({ where: { idAg: numericId } });
	
		await this.db.agencia.delete({ where: { id: numericId } });
	}

}
