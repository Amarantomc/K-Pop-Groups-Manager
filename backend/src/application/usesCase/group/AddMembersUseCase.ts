import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class AddMembersUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(
		groupId: string,
		artistIds: number[],
		artistRoles: string[]
	): Promise<GroupResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();

			const group = await this.groupRepository.findById(groupId);
			if (!group) throw new Error("Group not found");

			if (!Array.isArray(artistIds) || artistIds.length === 0)
				throw new Error("artistIds must be a non-empty array");
			if (!Array.isArray(artistRoles) || artistRoles.length === 0)
				throw new Error("artistRoles must be a non-empty array");
			if (artistIds.length !== artistRoles.length)
				throw new Error("artistIds and artistRoles must have the same length");

			await this.groupRepository.addMembers(group.id, artistIds, artistRoles);

			const updatedGroup = await this.groupRepository.findById(groupId);
			if (!updatedGroup) throw new Error("Failed to retrieve updated group");

			await this.unitOfWork.commit();
			return GroupResponseDTO.fromEntity(updatedGroup);
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
