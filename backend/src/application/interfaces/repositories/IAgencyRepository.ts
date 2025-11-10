import { Agency } from "../../../domain/entities/Agency";
import { CreateAgencyDTO } from "../../dtos/agency/CreateAgencyDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IAgencyRepository
	extends IBaseRepository<Agency, CreateAgencyDTO, any> {
	findByName(name: string): Promise<Agency[]>;
	findByAddress(address: string): Promise<Agency[]>;
	findByFoundation(foundation: Date): Promise<Agency[]>;
	findAll(): Promise<Agency[]>;
}
