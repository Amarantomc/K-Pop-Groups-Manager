import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";

@injectable()
export class UpdateGroupUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(
		id: string,
		payload: Partial<CreateGroupDTO>
	): Promise<GroupResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();
			const updated = await this.groupRepository.update(id, payload);
			await this.unitOfWork.commit();
			return GroupResponseDTO.fromEntity(updated);
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
