import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import type { IAlbumRepository } from "../../application/interfaces/repositories/IAlbumRepository";
import type { CreateAlbumDTO } from "../../application/dtos/album/CreateAlbumDTO";
import { AlbumResponseDTO } from "../../application/dtos/album/AlbumResponseDTO";
import type { Album } from "../../domain/entities/Album";

@injectable()
export class AlbumRepository implements IAlbumRepository {
	constructor(
		@inject(Types.PrismaClient) private prisma: any,
		@inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
	) {}

	private get db() {
		return this.unitOfWork.getTransaction();
	}

	async create(data: CreateAlbumDTO): Promise<Album> {
		const album = await this.db.album.create({
			data: {
				idGrupo: 1,
				idArt: 1,
				titulo: data.title,
				fechaLanzamiento: new Date(data.releaseDate),
				productor: data.producer,
				NoCanciones: data.songs.length,
				NoCopiasVendidas: 0,
				Canciones: {
					connect: data.songs.map((song) => ({ id: song })),
				},
			},
		});
		return AlbumResponseDTO.toEntity(album);
	}

	async findById(id: string): Promise<Album | null> {
		const album = await this.db.album.findUnique({
			where: { id: Number(id) },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntity(album) : null;
	}

	async update(id: string, data: Partial<Album>): Promise<Album> {
		const updated = await this.db.album.update({
			where: { id: Number(id) },
			data,
		});
		return AlbumResponseDTO.toEntity(updated);
	}

	async delete(id: string): Promise<void> {}

	async findAll(): Promise<Album[]> {
		const albums = await this.db.album.findMany();
		return AlbumResponseDTO.toEntities(albums);
	}

	async findByTitle(title: string): Promise<Album | null> {
		const album = await this.db.album.findFirst({
			where: { titulo: title },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntity(album) : null;
	}

	async findByReleaseDate(releaseDate: Date): Promise<Album | null> {
		const album = await this.db.album.findUnique({
			where: { fechaLanzamiento: releaseDate },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntity(album) : null;
	}

	async findByProducer(producer: string): Promise<Album[]> {
		const album = await this.db.album.findMany({
			where: { productor: producer },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntities(album) : [];
	}

	async findByNoSongs(noSongs: number): Promise<Album[]> {
		const album = await this.db.album.findMany({
			where: { NoCanciones: noSongs },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntities(album) : [];
	}

	async findByNoCopiesSold(noCopiesSold: number): Promise<Album[]> {
		const album = await this.db.album.findMany({
			where: { NoCopiasVendidas: noCopiesSold },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntities(album) : [];
	}

	async findByArtist(idArtist: number): Promise<Album[]> {
		const album = await this.db.album.findMany({
			where: { LanzamientoArtista: { idAp: idArtist } },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntities(album) : [];
	}

	async findByGroup(idGroup: number): Promise<Album[]> {
		const album = await this.db.album.findMany({
			where: { LanzamientoGrupo: { idGr: idGroup } },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntities(album) : [];
	}

	async findByAward(idAward: number): Promise<Album[]> {
		const album = await this.db.album.findMany({
			where: { Premios: { idPremio: idAward } },
			include: {
				Canciones: true,
				Premios: true,
				LanzamientoArtista: true,
				LanzamientoGrupo: true,
			},
		});
		return album ? AlbumResponseDTO.toEntities(album) : [];
	}

	async addAwards(albumId: number, awardIds: number[]): Promise<void> {
		for (let i = 0; i < awardIds.length; i++) {
			const awardId = awardIds[i];

			const award = this.db.premio.findUnique({ where: { idPremio: awardId } });
			if (!award) throw new Error("Award does'nt exist");

			const awardedAlbum = this.db.albumPremiado.findUnique({
				where: { idPremio: awardId },
			});
			if (awardedAlbum) throw new Error("Awarded album already exists");

			await this.db.albumPremiado.create({
				data: {
					idAlb: albumId,
					idPremio: awardId,
					año: new Date().getFullYear,
				},
			});
		}
	}
}
