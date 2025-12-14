import type { PopularityList, Song } from "../../../domain";
import type { CreatePopularityListDto } from "../../dtos/popularityList/CreatePopularityListDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IPopularityListRepository extends IBaseRepository<PopularityList,CreatePopularityListDto,any> {
    findAll(): Promise<PopularityList[]>;


    findSongByName(songName:string,popularityListId:number): Promise<Song>|null;
    addSongToPopularityList(popularityListId:number,songId:number): Promise<PopularityList>;
    deleteSongFromPopularityList(popularityListId:number,songId:number): Promise<PopularityList>;
    updatePositionInPopularityList(popularityListId: number, songId:number, position: number): Promise<PopularityList>
    findBySongId(songId:number): Promise<PopularityList[]>;

}

