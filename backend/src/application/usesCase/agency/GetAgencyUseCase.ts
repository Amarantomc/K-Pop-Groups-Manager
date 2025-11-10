import { inject, injectable } from "inversify";
import type { Agency } from "../../../domain/entities/Agency";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class GetAgencyUseCase {
	constructor(@inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository) {}

	async execute(id: string): Promise<AgencyResponseDTO> {
		const agency = await this.agencyRepository.findById(id);
		if (!agency) throw new Error("Agency not found");
		return new AgencyResponseDTO(
			agency.id,
			agency.name,
			agency.address,
			agency.foundation
		);
	}
}
