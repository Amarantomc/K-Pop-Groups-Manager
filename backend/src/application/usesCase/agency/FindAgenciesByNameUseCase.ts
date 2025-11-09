import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";

export class FindAgenciesByNameUseCase {
	constructor(private agencyRepository: IAgencyRepository) {}

	async execute(name: string): Promise<AgencyResponseDTO[]> {
		const agencies = await this.agencyRepository.findByName(name);
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
