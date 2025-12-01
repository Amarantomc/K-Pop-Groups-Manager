import type { Album } from "../../../domain/entities/Album";
import type { CreateAlbumDTO } from "../../dtos/album/CreateAlbumDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IAlbumRepository
	extends IBaseRepository<Album, CreateAlbumDTO, any> {
	findByTitle(title: string): Promise<Album | null>;
	findByReleaseDate(releaseDate: Date): Promise<Album | null>;
	findByProducer(producer: string): Promise<Album[]>;
	findByNoSongs(noSongs: number): Promise<Album[]>;
	findByNoCopiesSold(noCopiesSold: number): Promise<Album[]>;
	findByArtist(idArtist: number): Promise<Album[]>;
	findByGroup(idGroup: number): Promise<Album[]>;
	findByAward(idAward: number): Promise<Album[]>;
	findAll(): Promise<Album[]>;
	addAwards(albumId: number, awardIds: number[]): Promise<void>;
}
