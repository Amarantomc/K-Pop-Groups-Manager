import { inject, injectable } from "inversify";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class ListAgenciesUseCase {
	constructor(@inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository) {}

	async execute(): Promise<AgencyResponseDTO[]> {
		const list = await this.agencyRepository.findAll();
		return list.map(
			(a) => new AgencyResponseDTO(a.id, a.name, a.address, a.foundation)
		);
	}
}
