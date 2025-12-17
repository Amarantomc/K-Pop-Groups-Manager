import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class GroupsWithActiveContractsUseCase {
  constructor( 
    @inject(Types.IAgencyRepository)private readonly agencyRepository: IAgencyRepository
  ) {}

  async execute(agencyId: number,date: Date | string
  ) {
    const groups = await this.agencyRepository.groupsWithActiveContracts(agencyId,date);

    return GroupResponseDTO.fromEntities(groups);
  }
}