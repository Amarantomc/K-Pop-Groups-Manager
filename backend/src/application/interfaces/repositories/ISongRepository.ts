import type { Song } from "../../../domain";
import type { CreateSongDto } from "../../dtos/song/CreateSongDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface ISongRepository extends IBaseRepository<Song,CreateSongDto,any> {
  addToAlbum(songId: number, albumId: number): Promise<void>;
  searchByTitle(title: string): Promise<Song[]>;
}