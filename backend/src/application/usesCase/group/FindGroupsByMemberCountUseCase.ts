import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupsByMemberCountUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(memberCount: number): Promise<GroupResponseDTO[]> {
		const groups = await this.groupRepository.findByMemberCount(memberCount);
		return GroupResponseDTO.fromEntities(groups);
	}
}
