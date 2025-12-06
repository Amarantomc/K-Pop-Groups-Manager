import type { Song } from "../../../domain/entities/Song";
import type { CreateSongDTO } from "../../dtos/song/CreateSongDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface ISongRepository
	extends IBaseRepository<Song, CreateSongDTO, any> {
	findAll(): Promise<Song[]>;
	findByTitle(title: string): Promise<Song | null>;
	findByReleaseDate(releaseDate: Date): Promise<Song[]>;
	findByProducer(producer: string): Promise<Song[]>;
	findByGenre(genre: string): Promise<Song[]>;
	findByAlbum(idAlbum: number): Promise<Song[]>;
	findByPopList(idPopList: number): Promise<Song[]>;
	addPopLists(albumId: number, popListIds: number[]): Promise<void>;
}
