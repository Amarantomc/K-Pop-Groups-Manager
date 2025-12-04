import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupsByConceptUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(conceptId: number): Promise<GroupResponseDTO[]> {
		const groups = await this.groupRepository.findByConcept(conceptId);
		return GroupResponseDTO.fromEntities(groups);
	}
}
