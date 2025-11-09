import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";

export class FindAgenciesByFoundationUseCase {
	constructor(private agencyRepository: IAgencyRepository) {}

	async execute(foundation: Date): Promise<AgencyResponseDTO[]> {
		const agencies = await this.agencyRepository.findByFoundation(foundation);
		return agencies.map(
			(agency) =>
				new AgencyResponseDTO(
					agency.id,
					agency.name,
					agency.address,
					agency.foundation
				)
		);
	}
}
