import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";

@injectable()
export class DeleteGroupUseCase {
	constructor(
		@inject(Types.IGroupRepository) private groupRepository: IGroupRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(id: string): Promise<void> {
		try {
			await this.unitOfWork.beginTransaction();
			const group = await this.groupRepository.findById(id);
			if (!group) throw new Error("Group not found");
			await this.groupRepository.delete(id);
			await this.unitOfWork.commit();
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
