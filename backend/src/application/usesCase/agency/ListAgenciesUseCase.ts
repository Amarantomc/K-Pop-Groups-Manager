import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";

export class ListAgenciesUseCase {
	constructor(private agencyRepository: IAgencyRepository) {}

	async execute(): Promise<AgencyResponseDTO[]> {
		const list = await this.agencyRepository.findAll();
		return list.map(
			(a) => new AgencyResponseDTO(a.id, a.name, a.address, a.foundation)
		);
	}
}
