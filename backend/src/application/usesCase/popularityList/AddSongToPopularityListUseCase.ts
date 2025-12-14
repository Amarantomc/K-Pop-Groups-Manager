import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";

@injectable()
export class AddSongToPopularityListUseCase {
  constructor(
    @inject(Types.IPopularityListRepository) private popularityListRepository: IPopularityListRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {popularityListId: number;songId: number;}): Promise<void> {
    try {
      //console.log(command);
      await this.unitOfWork.beginTransaction();

      //console.log(this.unitOfWork.getTransaction().CancionEnListaDePopularidad.);
      const popularityList = await this.popularityListRepository.addSongToPopularityList(command.popularityListId,command.songId,);

      //console.log(popularityList);
      await this.unitOfWork.commit();
    } catch (error) {
      //console.log(error);
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}