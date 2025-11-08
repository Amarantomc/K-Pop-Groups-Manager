import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

export class DeleteAgencyUseCase {
	constructor(
		private agencyRepository: IAgencyRepository,
		private unitOfWork: IUnitOfWork
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
