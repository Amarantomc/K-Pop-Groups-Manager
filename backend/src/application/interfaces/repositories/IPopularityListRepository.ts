import type { PopularityList, Song } from "../../../domain";
import type { CreatePopularityListDto } from "../../dtos/popularityList/CreatepopularityListDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IPopularityListRepository extends IBaseRepository<PopularityList,CreatePopularityListDto,any> {
    findAll(): Promise<PopularityList[]>;


    findSongByName(songName:string,popularityListId:number): Promise<Song>|null;
    addSongToPopularityList(popularityListId:number,songId:number,year:number,position:number): Promise<void>;
}

