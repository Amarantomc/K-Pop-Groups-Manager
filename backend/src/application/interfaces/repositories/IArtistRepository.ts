import type { Apprentice } from "../../../domain";
import type { Artist } from "../../../domain/entities/Artist";
 
import type { CreateArtistDto } from "../../dtos/artist/CreateArtistDto";
import type { UpdateArtistDto } from "../../dtos/artist/UpdateArtistDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IArtistRepository extends IBaseRepository<Artist,CreateArtistDto,UpdateArtistDto>{

        getAll():Promise<Artist[]>
        findByName(name: string): Promise<Artist[]>;
        findByStatus(status: string): Promise<Artist[]>;
        
          // Métodos para tablas intermedias
  addGroupHistory(apprenticeId: number,groupId: number,debutGroupId: number,role: string,startDate: Date): Promise<void>;
  endGroupMembership(apprenticeId: number,groupId: number,debutGroupId: number,startDate: Date,endDate: Date): Promise<void>;
  getGroupHistory(apprenticeId: number,groupId: number): Promise<Array<{groupId: number;role: string;startDate: Date;endDate?: Date;}>>;

  addActivity(apprenticeId: number,groupId: number,activityId: number,accepted: boolean ): Promise<void>;
  getActivities(apprenticeId: number,groupId: number): Promise<Array<{activityId: number;accepted: boolean;}>>;
  addContract(apprenticeId: number,groupId: number,agencyId: number,startDate: Date,endDate?: Date,status?: string,initialConditions?: string,incomeDistribution?: string): Promise<void>;
  getContracts(apprenticeId: number,groupId: number): Promise<Array<{agencyId: number;startDate: Date;endDate?: Date;status: string;}>>;

  addRelease(apprenticeId: number,groupId: number,albumId: number,visualConceptId: number): Promise<void>;
  getReleases(apprenticeId: number,groupId: number): Promise<Array<{albumId: number;visualConceptId: number;}>>;
        

}