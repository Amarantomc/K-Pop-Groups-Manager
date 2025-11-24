import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class FindGroupByDebutUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository
	) {}

	async execute(debut: Date): Promise<GroupResponseDTO> {
		const group = await this.groupRepository.findByDebut(debut);
		if (!group) throw new Error("Group with this debut date not found");
		return GroupResponseDTO.fromEntity(group);
	}
}
