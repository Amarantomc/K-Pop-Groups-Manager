import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";

@injectable()
export class DeletePopularityListUseCase {
  constructor(@inject(Types.IPopularityListRepository) private popularityListRepository: IPopularityListRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(popularityListId: string): Promise<void> {
    
    try {
       await this.unitOfWork.beginTransaction();  
      const popularityList = await this.popularityListRepository.findById(popularityListId);

        if (!popularityList) {
            throw new Error("Popularity List not found");
          }

    await this.popularityListRepository.delete(popularityListId);
    await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
    
    
   
  }
}