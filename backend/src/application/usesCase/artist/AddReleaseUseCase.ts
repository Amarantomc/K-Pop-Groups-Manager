import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class AddReleaseUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {
    artistId: number;
    groupId: number;
    albumId: number;
    visualConceptId: number;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      if (command.albumId <= 0) {
        throw new Error("Invalid album ID");
      }

      if (command.visualConceptId <= 0) {
        throw new Error("Invalid visual concept ID");
      }

      await this.artistRepository.addRelease(
        command.artistId,
        command.groupId,
        command.albumId,
        command.visualConceptId
      );

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}