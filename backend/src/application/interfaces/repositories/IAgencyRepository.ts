import { Agency } from "../../../domain/entities/Agency";
import { CreateAgencyDTO } from "../../dtos/agency/CreateAgencyDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IAgencyRepository
	extends IBaseRepository<Agency, CreateAgencyDTO, any> {
	findByName(name: string): Promise<Agency | null>;
	findByAddress(address: string): Promise<Agency | null>;
	findByFoundation(foundation: Date): Promise<Agency | null>;
	findAll(): Promise<Agency[]>;
}
