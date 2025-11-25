import { Song } from "../../../domain";
import CreateSongDTO from "../../dtos/song/CreateSongDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface ISongRepository extends IBaseRepository<Song, CreateSongDTO, any> {

    findByTitle(title: string): Promise<Song[]>;
    findByProducer(producer: string): Promise<Song[]>;
    findByGender(gender: string): Promise<Song[]>;
    findAll(): Promise<Song[]>;

    //#region Lista de Popularidad
    addToPopularityList(songId:number,popularityListId:number,position:number,year:number):Promise<void>;
    removeFromPopularityList(songId:number,popularityListId:number,position:number,year:number):Promise<void>;
    getPopularityLists(songId:number,popularityListId:number):Promise<Array<{songId:number,popularityList:number,position:number,year:number}>>;
    updatePositionInPopularityList(songId:number,popularityListId:number,position:number):Promise<void>;
    updateYearInPopularityList(songId:number,popularityListId:number,position:number):Promise<void>;
    // #endregion Lista de Popularidad

    //#region Album
    addToAlbum(songId:number,albumId:number):Promise<void>;
    removeFromAlbum(songId:number,albumId:number):Promise<void>;
    getAlbums():Promise<Array<{songId:number,albumId:number}>>;
    //#endregion

}
