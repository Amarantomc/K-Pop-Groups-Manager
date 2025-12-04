import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAwardRepository } from "../../interfaces/repositories/IAwardRepository";
import { AwardResponseDto } from "../../dtos/award/AwardResposeDto";

@injectable()
export class GetAwardUseCase{
    constructor(@inject(Types.IAwardRepository) private AwardRepository: IAwardRepository){}

    async excute(awardId:string): Promise<AwardResponseDto> {

            const award = await this.AwardRepository.findById(awardId);
            if(!award)
            {
                throw new Error('Award not found');
            }

            return new AwardResponseDto(award.id, award.academyName, award.awardTitle,award.albums);
    }
}