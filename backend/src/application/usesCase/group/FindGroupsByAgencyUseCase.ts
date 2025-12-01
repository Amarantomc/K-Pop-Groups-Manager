import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupsByAgencyUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(agencyId: number): Promise<GroupResponseDTO[]> {
		const groups = await this.groupRepository.findByAgency(agencyId);
		return GroupResponseDTO.fromEntities(groups);
	}
}
