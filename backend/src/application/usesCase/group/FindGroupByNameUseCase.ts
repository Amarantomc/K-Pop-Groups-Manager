import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupByNameUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(name: string): Promise<GroupResponseDTO> {
		const group = await this.groupRepository.findByName(name);
		if (!group) throw new Error("Group with this name not found");
		return GroupResponseDTO.fromEntity(group);
	}
}
