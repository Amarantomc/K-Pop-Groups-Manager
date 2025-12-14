import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";

@injectable()
export class DeleteSongFromPopularityListUseCase {
  constructor(
    @inject(Types.IPopularityListRepository)
    private popularityListRepository: IPopularityListRepository,
    @inject(Types.IUnitOfWork)
    private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {
    popularityListId: number;
    songId: number;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      await this.popularityListRepository.deleteSongFromPopularityList(
        command.popularityListId,
        command.songId
      );


      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}