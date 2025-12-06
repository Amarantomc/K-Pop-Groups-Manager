import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import type { ISongRepository } from "../../application/interfaces/repositories/ISongRepository";
import type { CreateSongDTO } from "../../application/dtos/song/CreateSongDTO";
import { SongResponseDTO } from "../../application/dtos/song/SongResponseDTO";
import type { Song } from "../../domain/entities/Song";

@injectable()
export class SongRepository implements ISongRepository {
	constructor(
		@inject(Types.PrismaClient) private prisma: any,
		@inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
	) {}

	private get db() {
		return this.unitOfWork.getTransaction();
	}

	async create(data: CreateSongDTO): Promise<Song> {
		const song = await this.db.cancion.create({
			data: {
				titulo: data.title,
				fechaLanzamiento: data.releaseDate,
				productor: data.producer,
				genero: data.genre,
				Albums: {
					connect: data.albums.map((album) => ({ id: album })),
				},
			},
		});
		return this.findById(song.id) as Promise<Song>;
	}

	async findById(id: string): Promise<Song | null> {
		const song = await this.db.cancion.findUnique({
			where: { id: Number(id) },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return song ? SongResponseDTO.toEntity(song) : null;
	}

	async update(id: string, data: Partial<CreateSongDTO>): Promise<Song> {
		const updated = await this.db.cancion.update({
			where: { id: Number(id) },
			data: {
				titulo: data.title,
				fechaLanzamiento: data.releaseDate,
				productor: data.producer,
				genero: data.genre,
			},
		});
		return this.findById(updated.id) as Promise<Song>;
	}

	async delete(id: string): Promise<void> {
		throw new Error("Song deletion is not permitted");
	}

	async findAll(): Promise<Song[]> {
		const songs = await this.db.cancion.findMany({
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return SongResponseDTO.toEntities(songs);
	}

	async findByTitle(title: string): Promise<Song | null> {
		console.log(title);
		const song = await this.db.cancion.findFirst({
			where: { titulo: title },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		console.log(song);
		return song ? SongResponseDTO.toEntity(song) : null;
	}

	async findByReleaseDate(releaseDate: Date): Promise<Song[]> {
		const songs = await this.db.cancion.findMany({
			where: { fechaLanzamiento: releaseDate },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return songs ? SongResponseDTO.toEntities(songs) : [];
	}

	async findByProducer(producer: string): Promise<Song[]> {
		const songs = await this.db.cancion.findMany({
			where: { productor: producer },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return songs ? SongResponseDTO.toEntities(songs) : [];
	}

	async findByGenre(genre: string): Promise<Song[]> {
		const songs = await this.db.cancion.findMany({
			where: { genero: genre },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return songs ? SongResponseDTO.toEntities(songs) : [];
	}

	async findByAlbum(idAlbum: number): Promise<Song[]> {
		const songs = await this.db.cancion.findMany({
			where: { Albums: { id: idAlbum } },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return songs ? SongResponseDTO.toEntities(songs) : [];
	}

	async findByPopList(idPopList: number): Promise<Song[]> {
		const songs = await this.db.cancion.findMany({
			where: { ListaDePopularidad: { id: idPopList } },
			include: {
				Albums: true,
				ListasDePopularidad: true,
			},
		});
		return songs ? SongResponseDTO.toEntities(songs) : [];
	}

	async addPopLists(
		songId: number,
		popListIds: number[],
		songPositions: number[]
	): Promise<void> {
		for (let i = 0; i < popListIds.length; i++) {
			const popListId = popListIds[i];

			const popList = this.db.listaPopularidad.findUnique({
				where: { idPremio: popListId },
			});
			if (!popList) throw new Error("Popularity List not found");

			const songInPopList = this.db.cancionEnListaDePopularidad.findUnique({
				where: { idLista: popListId, idCa: songId },
			});
			if (songInPopList)
				throw new Error("This song is already in this Popularity List");

			await this.db.cancionEnListaDePopularidad.create({
				data: {
					idCa: songId,
					idLista: popListId,
					posicion: songPositions[i],
					año: new Date().getFullYear,
				},
			});
		}
	}
}
