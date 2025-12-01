import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupByVisualConceptUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(visualConceptId: number): Promise<GroupResponseDTO> {
		const group = await this.groupRepository.findByVisualConcept(
			visualConceptId
		);
		if (!group) throw new Error("Group with this visual concept not found");
		return GroupResponseDTO.fromEntity(group);
	}
}
