import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";

export class FindAgenciesByAddressUseCase {
	constructor(private agencyRepository: IAgencyRepository) {}

	async execute(address: string): Promise<AgencyResponseDTO[]> {
		const agencies = await this.agencyRepository.findByAddress(address);
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
