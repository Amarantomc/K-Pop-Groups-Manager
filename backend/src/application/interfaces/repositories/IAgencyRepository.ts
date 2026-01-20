import type { Activity, Album, Apprentice, Concept, Contract, Income, Song } from "../../../domain";
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
	getAgencyByApprenticeOrArtist(apprenticeId:number, groupId?:number):Promise<Agency>;
	groupByAgency(AgencyId:number):Promise<Group[]>;
	apprenticeByAgency(AgencyId:number):Promise<Apprentice[]>;
	artistByAgency(AgencyId:number):Promise<Artist[]>;
	conceptByAgency(AgencyId:number):Promise<Concept[]>;
	songByAgency(AgencyId:number):Promise<Song[]>;
	albumByAgency(AgencyId:number):Promise<Album[]>;
	activityByAgency(AgencyId:number):Promise<Activity[]>;
	contractByAgency(AgencyId:number):Promise<Contract[]>;
	incomeByAgency(AgencyId:number): Promise<Income>;

}
