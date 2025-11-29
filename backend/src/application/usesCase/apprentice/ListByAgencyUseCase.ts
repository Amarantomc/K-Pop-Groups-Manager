import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import  { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";

@injectable()
export class ListByAgencyUseCase {

constructor(@inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository) { }
 
async execute(agencyId:number): Promise<ApprenticeResponseDto[]> {
        const list = await this.apprenticeRepository.listByAgency(agencyId);
        
        return ApprenticeResponseDto.fromEntities(list)
    }
}