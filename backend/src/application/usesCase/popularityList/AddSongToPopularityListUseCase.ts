import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";
import { popularityListFields } from '../../../../../frontend/src/config/formSource';
import PopularityList from '../../../domain/entities/PopularityList';

@injectable()
export class AddSongToPopularityListUseCase {
  constructor(
    @inject(Types.IPopularityListRepository)
    private popularityListRepository: IPopularityListRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {
    popularityListId: number;
    songId: number;
    year: number;
    position: number;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      if(command.position <= 0){
            throw new Error('Invalid Position');
      }


      await this.popularityListRepository.addSongToPopularityList(
        command.popularityListId,
        command.songId,
        command.year,
        command.position
      );

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}