import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";

@injectable()
export class FindAgenciesByFoundationUseCase {
	constructor(@inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository) {}

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
