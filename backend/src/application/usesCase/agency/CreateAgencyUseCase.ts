import { CreateAgencyDTO } from "../../dtos/agency/CreateAgencyDTO";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

export class CreateAgencyUseCase {
	constructor(
		private agencyRepository: IAgencyRepository,
		private unitOfWork: IUnitOfWork
	) {}

	async execute(command: CreateAgencyDTO): Promise<AgencyResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();
			const existingAgencies = await this.agencyRepository.findByName(
				command.name
			);
			if (existingAgencies.length > 0) {
				throw new Error("Agency with this name already exists");
			}
			const agency = await this.agencyRepository.create(command);
			await this.unitOfWork.commit();
			return new AgencyResponseDTO(
				agency.id,
				agency.name,
				agency.address,
				agency.foundation
			);
		} catch (error) {
			await this.unitOfWork.commit();
			throw error;
		}
	}
}
