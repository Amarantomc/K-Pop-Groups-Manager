import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../../domain";
import type { Status } from "../../../domain/enums/ApprenticeStatus";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class GetApprenticeUseCase{
    constructor(@inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository){}

    async excute(apprenticeId:string): Promise<ApprenticeResponseDto> {

            const apprentice = await this.apprenticeRepository.findById(apprenticeId);
            if(!apprentice)
            {
                throw new Error('Apprentice not found');
            }

            return new ApprenticeResponseDto(apprentice.id, apprentice.name, apprentice.dateOfBirth,apprentice.age,apprentice.trainingLv ,apprentice.status);
    }
}