import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreatePopularityListDto } from "../../dtos/popularityList/CreatepopularityListDto";
import { PopularityListResponseDto } from "../../dtos/popularityList/PopularityListResponseDto";
import PopularityList from '../../../domain/entities/PopularityList';

@injectable()
export class CreatePopularityListUseCase{

    constructor(
    @inject(Types.IPopularityListRepository) private popularityListRepository: IPopularityListRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreatePopularityListDto):Promise<PopularityListResponseDto>{
        try
        {
            await this.unitOfWork.beginTransaction();
            const popularityList = await this.popularityListRepository.create(command);
            await this.unitOfWork.commit();
            
            return new PopularityListResponseDto(
                popularityList.id,
                popularityList.name,
                popularityList.listType,
                popularityList.songs
            );
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}