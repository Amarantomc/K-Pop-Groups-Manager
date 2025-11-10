import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class DeleteAgencyUseCase {
	constructor(
		@inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(id: string): Promise<void> {
		try {
			await this.unitOfWork.beginTransaction();
			await this.agencyRepository.delete(id);
			await this.unitOfWork.commit();
		} catch (err) {
			await this.unitOfWork.rollback();
			throw err;
		}
	}
}
