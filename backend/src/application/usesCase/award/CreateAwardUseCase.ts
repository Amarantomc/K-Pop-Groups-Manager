import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAwardRepository } from "../../interfaces/repositories/IAwardRepository";
import type { CreateAwardDto } from "../../dtos/award/CreateAwardDto";
import { AwardResponseDto } from "../../dtos/award/AwardResposeDto";


@injectable()
export class CreateAwardUseCase{

    constructor(
    @inject(Types.IAwardRepository) private AwardRepository: IAwardRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateAwardDto):Promise<AwardResponseDto>{
        try
        {
            await this.unitOfWork.beginTransaction();
            const award = await this.AwardRepository.create(command);
            await this.unitOfWork.commit();
            
            return new AwardResponseDto(
                award.id,
                award.academyName,
                award.awardTitle,
            );
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}