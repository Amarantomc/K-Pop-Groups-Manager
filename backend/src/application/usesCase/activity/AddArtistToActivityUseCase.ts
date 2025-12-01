 
import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { ArtistOnActivityDto } from "../../dtos/activity/ArtistOnActivityDto";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";

@injectable()
export class AddArtistToActivityUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork,
    @inject(Types.IArtistRepository) private artistRepository:IArtistRepository
  ) {}

  async execute(command:ArtistOnActivityDto): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      const activity = await this.activityRepository.findById(command.activityId.toString());
      if (!activity) {
        throw new Error("Activity not found");
      }

      const artist= await this.artistRepository.findById({apprenticeId:command.apprenticeId,groupId:command.groupId} as any)

      if(!artist){
        throw new Error("Artist not found")
      }

      await this.activityRepository.addArtist(command);

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}