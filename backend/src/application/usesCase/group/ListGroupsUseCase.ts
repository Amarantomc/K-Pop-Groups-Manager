import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class ListGroupsUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(): Promise<GroupResponseDTO[]> {
		const list = await this.groupRepository.findAll();
		return GroupResponseDTO.fromEntities(list);
	}
}
