import { Agency } from "../../../domain/entities/Agency";
import type { Artist } from "../../../domain/entities/Artist";
import type { Group } from "../../../domain/entities/Group";
import { CreateAgencyDTO } from "../../dtos/agency/CreateAgencyDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IAgencyRepository
	extends IBaseRepository<Agency, CreateAgencyDTO, any> {
	findByName(name: string): Promise<Agency[]>;
	findByAddress(address: string): Promise<Agency[]>;
	findByFoundation(foundation: Date): Promise<Agency[]>;
	findAll(): Promise<Agency[]>;
	artistsWithActiveContracts(AgencyId:number,date: Date | string):Promise<Artist[]>;
	groupsWithActiveContracts(AgencyId:number,date: Date | string):Promise<Group[]>;

}
