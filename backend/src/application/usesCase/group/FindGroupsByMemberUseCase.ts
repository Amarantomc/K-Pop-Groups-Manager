import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupsByMemberUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(memberId: number): Promise<GroupResponseDTO[]> {
		const groups = await this.groupRepository.findByMember(memberId);
		return GroupResponseDTO.fromEntities(groups);
	}
}
