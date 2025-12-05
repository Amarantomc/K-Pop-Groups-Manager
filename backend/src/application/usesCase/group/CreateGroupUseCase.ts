import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";

@injectable()
export class CreateGroupUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
	) {}

	async execute(command: CreateGroupDTO): Promise<GroupResponseDTO> {
		try {
			 

			await this.unitOfWork.beginTransaction();

			const existingGroup = await this.groupRepository.findByName(command.name);
			if (existingGroup) throw new Error("Group with this name already exists");

			const group = await this.groupRepository.create(command);
			await this.unitOfWork.commit();

			return GroupResponseDTO.fromEntity(group);
		} catch (error) {
			console.log(error)
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
