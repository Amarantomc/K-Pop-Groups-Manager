import { inject, injectable } from "inversify";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class FindAgenciesByAddressUseCase {
	constructor(@inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository) {}

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
