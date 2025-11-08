import type { Agency } from "../../../domain/entities/Agency";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

export class UpdateAgencyUseCase {
	constructor(
		private agencyRepository: IAgencyRepository,
		private unitOfWork: IUnitOfWork
	) {}

	async execute(
		id: string,
		payload: { name?: string; address?: string; foundation?: Date }
	): Promise<Agency> {
		try {
			await this.unitOfWork.beginTransaction();
			const updated = await this.agencyRepository.update(id, payload);
			await this.unitOfWork.commit();
			return updated;
		} catch (err) {
			await this.unitOfWork.rollback();
			throw err;
		}
	}
}
