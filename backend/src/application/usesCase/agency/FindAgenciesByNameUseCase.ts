import { inject, injectable } from "inversify";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class FindAgenciesByNameUseCase {
	constructor(@inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository) {}

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
