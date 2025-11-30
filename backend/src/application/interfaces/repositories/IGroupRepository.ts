import type { Group } from "../../../domain/entities/Group";
import type { GroupStatus } from "../../../domain/enums/GroupStatus";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import type { IBaseRepository } from "./IBaseRepository";

export interface IGroupRepository
	extends IBaseRepository<Group, CreateGroupDTO, any> {
	findByName(name: string): Promise<Group | null>;
	findByDebut(debut: Date): Promise<Group | null>;
	findByStatus(status: GroupStatus): Promise<Group[]>;
	findByMemberCount(members: number): Promise<Group[]>;
	findByMember(member: number): Promise<Group[]>;
	findByAgency(agency: number): Promise<Group[]>;
	findByConcept(concept: number): Promise<Group[]>;
	findByVisualConcept(visualConcept: number): Promise<Group | null>;
	findAll(): Promise<Group[]>;
	addMembers(
		groupId: number,
		artistIds: number[],
		artistRoles: string[]
	): Promise<void>;
	removeMembers(groupId: number, artistIds: number[]): Promise<void>;
	addAlbums(groupId: number, albumIds: number[]): Promise<void>;
	addActivities(groupId: number, activityIds: number[]): Promise<void>;
}
