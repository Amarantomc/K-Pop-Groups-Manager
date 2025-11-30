import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class GetGroupUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(id: string): Promise<GroupResponseDTO> {
		const group = await this.groupRepository.findById(id);
		console.log(group);
		if (!group) throw new Error("Group not found");
		return GroupResponseDTO.fromEntity(group);
	}
}
