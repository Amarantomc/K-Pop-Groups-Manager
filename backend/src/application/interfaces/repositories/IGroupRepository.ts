import type { Group } from "../../../domain/entities/Group";
import type { GroupStatus } from "../../../domain/enums/GroupStatus";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IGroupRepository
	extends IBaseRepository<Group, CreateGroupDTO, any> {
	findByName(name: string): Promise<Group | null>;
	findByDebut(debut: Date): Promise<Group | null>;
	findByMembers(members: number): Promise<Group[]>;
	findByStatus(status: GroupStatus): Promise<Group[]>;
	findByAgency(agency: number): Promise<Group[]>;
	findByConcept(concept: number): Promise<Group[]>;
	findByVisualConcept(visualConcept: number): Promise<Group | null>;
	findAll(): Promise<Group[]>;
}
