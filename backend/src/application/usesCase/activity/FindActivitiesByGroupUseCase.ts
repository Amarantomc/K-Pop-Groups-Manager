import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";

@injectable()
export class FindActivitiesByGroupUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository,
    @inject(Types.IGroupRepository) private groupRepository: IGroupRepository
  ) {}

  async execute(groupId: string): Promise<ActivityResponseDto[]> {
     try {
        
      const group= await this.groupRepository.findById(groupId);
      if (!group){
      throw new Error("Group not found");
      }
    const activities = await this.activityRepository.findByGroup(Number(groupId));
    if(!activities){
      throw new Error("No activities found for this group");
    } 
    
    return ActivityResponseDto.fromEntities(activities);
     } catch (error) {
        throw error
     }
  
  }
}