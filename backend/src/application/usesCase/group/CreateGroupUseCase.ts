import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class CreateGroupUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(command: CreateGroupDTO): Promise<GroupResponseDTO> {
		try {
			if (!command.members || command.members.length == 0)
				throw new Error("Members has to be a non empty array");
			if (!command.roles || command.roles.length == 0)
				throw new Error("Roles has to be a non empty array");

			await this.unitOfWork.beginTransaction();

			const existingGroup = await this.groupRepository.findByName(command.name);
			if (existingGroup) throw new Error("Group with this name already exists");

			const group = await this.groupRepository.create(command);
			console.log(group);
			await this.unitOfWork.commit();

			return GroupResponseDTO.fromEntity(group);
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
