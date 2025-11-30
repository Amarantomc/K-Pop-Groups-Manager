import { inject, injectable } from "inversify";
import type { CreateGroupDTO } from "../../application/dtos/group/CreateGroupDTO";
import { GroupResponseDTO } from "../../application/dtos/group/GroupResponseDTO";
import type { IGroupRepository } from "../../application/interfaces/repositories/IGroupRepository";
import type { Group } from "../../domain/entities/Group";
import type { GroupStatus } from "../../domain/enums/GroupStatus";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Types } from "../di/Types";

@injectable()
export class GroupRepository implements IGroupRepository {
	constructor(
		@inject(Types.PrismaClient) private prisma: any,
		@inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
	) {}

	private get db() {
		return this.unitOfWork.getTransaction();
	}

	async create(data: CreateGroupDTO): Promise<Group> {
		const group = await this.db.grupo.create({
			data: {
				nombreCompleto: data.name,
				fechaDebut: data.debut,
				estadoGrupo: data.status,
				Nomiembros: data.members.length || 0,
				idConcepto: data.IdConcept, // Falta tener la propiedad IdVisualConcept en la base de datos
				Agencias: {
					connect: { id: data.IdAgency },
				},
			},
		});
		const today = new Date();
		for (const artistId of data.members || []) {
			const artist = await this.db.artista.findFirst({
				where: { idAp: artistId },
			});
			if (!artist) throw new Error(`Artist with id ${artistId} not found`);
			await this.db.artistaEnGrupo.create({
				data: {
					idAp: artistId,
					idGrupoDebut: artist.idGr,
					idGr: group.id,
					fechaInicio: today,
					rol: "miembro",
				},
			});
		}
		for (const albumId of data.albums || []) {
			await this.db.album.update({
				where: { id: albumId },
				data: { idGrupo: group.id },
			});
		}
		for (const activityId of data.activities || []) {
			await this.db.grupoEnActividad.create({
				data: {
					idGr: group.id,
					idAct: activityId,
					aceptado: true,
				},
			});
		}
		return GroupResponseDTO.toEntity(group);
	}

	async findById(id: any): Promise<Group | null> {
		id = Number(id);
		const group = await this.db.grupo.findUnique({
			where: { id },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return !group
			? null
			: GroupResponseDTO.toEntity({
					...group,
					members: group.HistorialArtistas.map((a: any) => a.idAp),
					albums: group.Album.map((a: any) => a.id),
					activities: group.Actividades.map((a: any) => a.idAct),
			  });
	}

	async update(id: string, data: Partial<CreateGroupDTO>): Promise<Group> {
		const updateData: any = {};
		if (data.name) updateData.nombreCompleto = data.name;
		if (data.debut) updateData.fechaDebut = new Date(data.debut);
		if (data.status) updateData.estadoGrupo = data.status;

		const updated = await this.db.grupo.update({
			where: { id: Number(id) },
			data: updateData,
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return GroupResponseDTO.toEntity({
			...updated,
			members: updated.HistorialArtistas.map((a: any) => a.idAp),
			albums: updated.Album.map((a: any) => a.id),
			activities: updated.Actividades.map((a: any) => a.idAct),
		});
	}

	async delete(id: any): Promise<void> {} // No se debería borrar grupo por la lógica de negocio

	async findByName(name: string): Promise<Group | null> {
		const group = await this.db.grupo.findFirst({
			where: { nombreCompleto: name },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return !group
			? null
			: GroupResponseDTO.toEntity({
					...group,
					members: group.HistorialArtistas.map((a: any) => a.idAp),
					albums: group.Album.map((a: any) => a.id),
					activities: group.Actividades.map((a: any) => a.idAct),
			  });
	}

	async findByDebut(debut: Date): Promise<Group | null> {
		const group = await this.db.grupo.findFirst({
			where: { fechaDebut: debut },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return !group
			? null
			: GroupResponseDTO.toEntity({
					...group,
					members: group.HistorialArtistas.map((a: any) => a.idAp),
					albums: group.Album.map((a: any) => a.id),
					activities: group.Actividades.map((a: any) => a.idAct),
			  });
	}

	async findByStatus(status: GroupStatus): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			where: { estadoGrupo: status },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return groups.map((group: any) =>
			GroupResponseDTO.toEntity({
				...group,
				members: group.HistorialArtistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByMemberCount(members: number): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			where: { Nomiembros: members },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return groups.map((group: any) =>
			GroupResponseDTO.toEntity({
				...group,
				members: group.HistorialArtistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByMember(memberId: number): Promise<Group[]> {
		const artistsInGroup = await this.db.artistaEnGrupo.findMany({
			where: { idAp: memberId },
			include: {
				grupo: {
					include: {
						HistorialArtistas: {
							select: { idAp: true },
						},
						Album: {
							select: { id: true },
						},
						Actividades: {
							select: { idAct: true },
						},
					},
				},
			},
		});
		return artistsInGroup.map((artista: any) =>
			GroupResponseDTO.toEntity({
				...artista.grupo,
				members: artista.grupo.HistorialArtistas.map((a: any) => a.idAp),
				albums: artista.grupo.Album.map((a: any) => a.id),
				activities: artista.grupo.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByAgency(IdAgency: number): Promise<Group[]> {
		const grupos = await this.db.agencia.findUnique({
			where: { id: IdAgency },
			include: {
				Grupos: {
					include: {
						HistorialArtistas: {
							where: { fechaFinalizacion: null },
							select: { idAp: true },
						},
						Album: {
							select: { id: true },
						},
						Actividades: {
							select: { idAct: true },
						},
					},
				},
			},
		});
		return !grupos
			? []
			: grupos.Grupos.map((group: any) =>
					GroupResponseDTO.toEntity({
						...group,
						members: group.HistorialArtistas.map((a: any) => a.idAp),
						albums: group.Album.map((a: any) => a.id),
						activities: group.Actividades.map((a: any) => a.idAct),
					})
			  );
	}

	async findByConcept(IdConcept: number): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			where: { idConcepto: IdConcept },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return groups.map((group: any) =>
			GroupResponseDTO.toEntity({
				...group,
				members: group.HistorialArtistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByVisualConcept(IdVisualConcept: number): Promise<Group | null> {
		const visualConcept = await this.db.conceptoVisual.findUnique({
			where: { idConcepto: IdVisualConcept },
		});
		if (!visualConcept) return null;

		const group = await this.db.grupo.findFirst({
			where: { idConcepto: visualConcept.idConcepto },
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return !group
			? null
			: GroupResponseDTO.toEntity({
					...group,
					members: group.HistorialArtistas.map((a: any) => a.idAp),
					albums: group.Album.map((a: any) => a.id),
					activities: group.Actividades.map((a: any) => a.idAct),
			  });
	}

	async findAll(): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			include: {
				HistorialArtistas: {
					where: { fechaFinalizacion: null },
					select: { idAp: true },
				},
				Album: {
					select: { id: true },
				},
				Actividades: {
					select: { idAct: true },
				},
			},
		});
		return groups.map((group: any) =>
			GroupResponseDTO.toEntity({
				...group,
				members: group.HistorialArtistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async addMembers(
		groupId: number,
		artistIds: number[],
		artistRoles: string[]
	): Promise<void> {
		const today = new Date();
		for (let i = 0; i < artistIds.length; i++) {
			const artist = await this.db.artista.findFirst({
				where: { idAp: artistIds[i] },
			});
			if (!artist) throw new Error(`Artist with id ${artistIds[i]} not found`);
			await this.db.artistaEnGrupo.create({
				data: {
					idAp: artistIds[i],
					idGrupoDebut: artist.idGr,
					idGr: groupId,
					fechaInicio: today,
					rol: artistRoles[i],
				},
			});
			await this.db.grupo.update({
				where: { id: groupId },
				data: { Nomiembros: { increment: 1 } },
			});
		}
	}

	async removeMembers(groupId: number, artistIds: number[]): Promise<void> {
		const today = new Date();
		for (const artistId of artistIds) {
			const artist = await this.db.artistaEnGrupo.findFirst({
				where: {
					idAp: artistId,
					idGr: groupId,
					fechaFinalizacion: null,
				},
			});
			if (!artist)
				throw new Error(
					`Artist ${artistId} is not currently a member of group ${groupId}`
				);
			await this.db.artistaEnGrupo.update({
				where: {
					idAp_idGrupoDebut_idGr_fechaInicio: {
						idAp: artist.idAp,
						idGrupoDebut: artist.idGrupoDebut,
						idGr: artist.idGr,
						fechaInicio: artist.fechaInicio,
					},
				},
				data: {
					fechaFinalizacion: today,
				},
			});
			await this.db.grupo.update({
				where: { id: groupId },
				data: { Nomiembros: { decrement: 1 } },
			});
		}
	}

	async addAlbums(groupId: number, albumIds: number[]): Promise<void> {
		for (const albumId of albumIds) {
			const album = await this.db.album.findUnique({
				where: { id: albumId },
			});
			if (!album) throw new Error(`Album with id ${albumId} not found`);
			await this.db.album.update({
				where: { id: albumId },
				data: { idGrupo: groupId },
			});
		}
	}

	async addActivities(groupId: number, activityIds: number[]): Promise<void> {
		for (const activityId of activityIds) {
			const activity = await this.db.actividad.findUnique({
				where: { id: activityId },
			});
			if (!activity)
				throw new Error(`Activity with id ${activityId} not found`);
			const existing = await this.db.grupoEnActividad.findFirst({
				where: {
					idGr: groupId,
					idAct: activityId,
				},
			});
			if (existing) continue;
			await this.db.grupoEnActividad.create({
				data: {
					idGr: groupId,
					idAct: activityId,
					aceptado: true,
				},
			});
		}
	}
}
