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
				fechaDebut: new Date(data.debut),
				estadoGrupo: data.status,
				Nomiembros: data.members?.length || 0,
				idConcepto: data.IdConcept,
				idConceptoVisual: data.IdVisualConcept,
				Agencias: {
					connect: { id: data.IdAgency },
				},
			},
		});

		if (data.members && data.members.length > 0) {
			const today = new Date();
			for (const artistId of data.members) {
				const artist = await this.db.artista.findFirst({
					where: { idAp: artistId },
				});

				if (!artist) {
					throw new Error(`Artist with id ${artistId} not found`);
				}

				await this.db.artistaEnGrupo.create({
					data: {
						idAp: artistId,
						idGrupoDebut: artist.idGr,
						idGr: group.id,
						fechaInicio: today,
						rol: artist.rol,
					},
				});
			}
		}

		if (data.albums && data.albums.length > 0) {
			for (const albumId of data.albums) {
				await this.db.album.update({
					where: { id: albumId },
					data: { idGrupo: group.id },
				});
			}
		}

		if (data.activities && data.activities.length > 0) {
			for (const activityId of data.activities) {
				await this.db.grupoEnActividad.create({
					data: {
						idGr: group.id,
						idAct: activityId,
						aceptado: true,
					},
				});
			}
		}

		return GroupResponseDTO.toEntity(group);
	}

	async findById(id: any): Promise<Group | null> {
		id = Number(id);
		const group = await this.db.grupo.findUnique({
			where: { id },
			include: {
				Artistas: {
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

		if (!group) return null;

		return GroupResponseDTO.toEntity({
			...group,
			members: group.Artistas.map((a: any) => a.idAp),
			albums: group.Album.map((a: any) => a.id),
			activities: group.Actividades.map((a: any) => a.idAct),
		});
	}

	async update(id: string, data: Partial<CreateGroupDTO>): Promise<Group> {
		// ! Promise<Partial<GroupResponseDTO>>
		const updateData: any = {};

		if (data.name) updateData.nombreCompleto = data.name;
		if (data.debut) updateData.fechaDebut = new Date(data.debut);
		if (data.status) updateData.estadoGrupo = data.status;
		if (data.memberCount !== undefined)
			updateData.Nomiembros = data.memberCount;
		if (data.IdConcept) updateData.idConcepto = data.IdConcept;

		const updated = await this.db.grupo.update({
			where: { id: Number(id) },
			data: updateData,
			include: {
				Artistas: {
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
			members: updated.Artistas.map((a: any) => a.idAp),
			albums: updated.Album.map((a: any) => a.id),
			activities: updated.Actividades.map((a: any) => a.idAct),
		});
	}

	async delete(id: any): Promise<void> {
		id = Number(id);

		await this.db.grupoEnActividad.deleteMany({
			where: { idGr: id },
		});

		await this.db.grupo.delete({
			where: { id },
		});
	}

	async findByName(name: string): Promise<Group | null> {
		const group = await this.db.grupo.findFirst({
			where: { nombreCompleto: name },
			include: {
				Artistas: {
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

		if (!group) return null;

		return GroupResponseDTO.toEntity({
			...group,
			members: group.Artistas.map((a: any) => a.idAp),
			albums: group.Album.map((a: any) => a.id),
			activities: group.Actividades.map((a: any) => a.idAct),
		});
	}

	async findByDebut(debut: Date): Promise<Group | null> {
		const group = await this.db.grupo.findFirst({
			where: { fechaDebut: debut },
			include: {
				Artistas: {
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

		if (!group) return null;

		return GroupResponseDTO.toEntity({
			...group,
			members: group.Artistas.map((a: any) => a.idAp),
			albums: group.Album.map((a: any) => a.id),
			activities: group.Actividades.map((a: any) => a.idAct),
		});
	}

	async findByStatus(status: GroupStatus): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			where: { estadoGrupo: status },
			include: {
				Artistas: {
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
				members: group.Artistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByMemberCount(members: number): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			where: { Nomiembros: members },
			include: {
				Artistas: {
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
				members: group.Artistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByMember(member: number): Promise<Group[]> {
		const artistsInGroup = await this.db.artistaEnGrupo.findMany({
			where: { idAp: member, fechaFinalizacion: null },
			include: {
				grupo: {
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
						Artistas: {
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

		if (!grupos) return [];

		return grupos.Grupos.map((group: any) =>
			GroupResponseDTO.toEntity({
				...group,
				members: group.Artistas.map((a: any) => a.idAp),
				albums: group.Album.map((a: any) => a.id),
				activities: group.Actividades.map((a: any) => a.idAct),
			})
		);
	}

	async findByConcept(IdConcept: number): Promise<Group[]> {
		const groups = await this.db.grupo.findMany({
			where: { idConcepto: IdConcept },
			include: {
				Artistas: {
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
				members: group.Artistas.map((a: any) => a.idAp),
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
				Artistas: {
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

		if (!group) return null;

		return GroupResponseDTO.toEntity({
			...group,
			members: group.Artistas.map((a: any) => a.idAp),
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

	async addMembers(groupId: number, artistIds: number[]): Promise<void> {
		for (const artistId of artistIds) {
			const artist = await this.db.artista.findFirst({
				where: { idAp: artistId },
			});

			if (!artist) {
				throw new Error(`Artist with id ${artistId} not found`);
			}

			const today = new Date();
			await this.db.artistaEnGrupo.create({
				data: {
					idAp: artistId,
					idGrupoDebut: artist.idGr,
					idGr: groupId,
					fechaInicio: today,
					rol: artist.role,
				},
			});

			await this.db.grupo.update({
				where: { id: groupId },
				data: { Nomiembros: { increment: 1 } },
			});
		}
	}

	async removeMembers(groupId: number, artistIds: number[]): Promise<void> {
		for (const artistId of artistIds) {
			const artist = await this.db.artistaEnGrupo.findFirst({
				where: {
					idAp: artistId,
					idGr: groupId,
					fechaFinalizacion: null,
				},
			});

			if (!artist) {
				throw new Error(
					`Artist ${artistId} is not currently a member of group ${groupId}`
				);
			}

			await this.db.artistaEnGrupo.update({
				where: {
					idAp_idGrupoDebut_idGr_fechaInicio: {
						idAp: artist.idAp,
						idGrupoDebut: artist.idGrupoDebut,
						idGr: artist.idGr,
						fechaInicio: artist.fechaInicio,
					},
				},
				data: { fechaFinalizacion: new Date() },
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

			if (!album) {
				throw new Error(`Album with id ${albumId} not found`);
			}

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

			if (!activity) {
				throw new Error(`Activity with id ${activityId} not found`);
			}

			const existing = await this.db.grupoEnActividad.findFirst({
				where: {
					idGr: groupId,
					idAct: activityId,
				},
			});

			if (!existing) {
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
}
