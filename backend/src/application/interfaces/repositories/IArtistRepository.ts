import type { Apprentice } from "../../../domain";
import type { Artist } from "../../../domain/entities/Artist";
import type { GroupMembership } from "../../../domain/value objects/GroupMembership";
import type { CreateArtistDto } from "../../dtos/artist/CreateArtistDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IArtistRepository extends IBaseRepository<Artist,CreateArtistDto,any>{

        getAll():Promise<Artist[]>
        findByName(name: string): Promise<Artist[]>;
        findByStatus(status: string): Promise<Artist[]>;
        
        getArtistGroup(id:any):Promise<GroupMembership|null>
        getGroupHistory(id:any): Promise<GroupMembership[]>
        
        getRelatedApprentice():Promise<Apprentice>
         
        findActiveContract(artistId: number): Promise<any>;
        findContractHistory(artistId: number): Promise<any[]>;
 
        findActivities(artistId: number): Promise<any[]>;
        findAcceptedActivities(artistId: number): Promise<any[]>;
  
   
        findReleases(artistId: number): Promise<any[]>;
  
  
        findGroupRequests(artistId: number): Promise<any[]>;
        

}