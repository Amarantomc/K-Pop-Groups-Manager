import type { Group } from "../../../domain/entities/Group";
import type { Agency } from "../../../domain/entities/Agency";
import type { Concept } from "../../../domain/entities/Concept";
import type { VisualConcept } from "../../../domain/entities/VisualConcept";
import type { Artist } from "../../../domain/entities/Artist";
import type { GroupStatus } from "../../../domain/enums/GroupStatus";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IGroupRepository
	extends IBaseRepository<Group, CreateGroupDTO, any> {
	findByName(name: string): Promise<Group | null>;
	findByDebut(debut: Date): Promise<Group | null>;
	findByMemberCount(members: number): Promise<Group[]>;
	findByMember(member: Artist): Promise<Group[]>;
	findByStatus(status: GroupStatus): Promise<Group[]>;
	findByAgency(agency: Agency): Promise<Group[]>;
	findByConcept(concept: Concept): Promise<Group[]>;
	findByVisualConcept(visualConcept: VisualConcept): Promise<Group | null>;
	findAll(): Promise<Group[]>;
}
