import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../../domain";
import type { Status } from "../../../domain/enums/ApprenticeStatus";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class GetApprenticeByNameUseCase{
    constructor(@inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository){}

    async excute(apprenticeName:string): Promise<ApprenticeResponseDto> {

            const apprentice = await this.apprenticeRepository.findByName(apprenticeName);
            if(!apprentice)
            {
                throw new Error('Apprentice not found');
            }

            return new ApprenticeResponseDto(apprentice.id, apprentice.name, apprentice.dateOfBirth,apprentice.age,apprentice.trainingLv ,apprentice.status);
    }
}