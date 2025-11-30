import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";
import { GroupStatus } from "../../../domain/enums/GroupStatus";

@injectable()
export class FindGroupsByStatusUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(status: GroupStatus): Promise<GroupResponseDTO[]> {
		const groups = await this.groupRepository.findByStatus(status);
		return GroupResponseDTO.fromEntities(groups);
	}
}
