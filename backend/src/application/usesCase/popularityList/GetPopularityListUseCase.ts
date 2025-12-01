
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { popularityListFields } from '../../../../../frontend/src/config/formSource';
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";
import { PopularityListResponseDto } from "../../dtos/popularityList/PopularityListResponseDto";

@injectable()
export class GetPopularityListUseCase{
    constructor(@inject(Types.IPopularityListRepository) private popularityListRepository: IPopularityListRepository){}

    async excute(popularityListId:string): Promise<PopularityListResponseDto> {

        try {
             const popularityList = await this.popularityListRepository.findById(popularityListId);
            if(!popularityList)
            {
                throw new Error('Popularity List not found');
            }

            return new PopularityListResponseDto(popularityList.id, popularityList.name, popularityList.listType,popularityList.songs);
        } catch (error) {
            throw error
        }    
       
    }
}