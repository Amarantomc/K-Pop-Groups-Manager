import type { Apprentice } from "../../../domain";
import type { Artist } from "../../../domain/entities/Artist";
import type { CreateArtistDto } from "../../dtos/artist/CreateArtistDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IArtistRepository extends IBaseRepository<Artist,CreateArtistDto,any>{

        getAll():Promise<Artist[]>
        getArtistGroup(id:any):Promise<any>
        getGroupHistory(id:any): Promise<any>
        getRelatedApprentice():Promise<Apprentice>
        getContracts():Promise<any>
        getArtistActivites():Promise<any>
        getArtistReleases():Promise<any>
        getArtistSol():Promise<any>
        

}