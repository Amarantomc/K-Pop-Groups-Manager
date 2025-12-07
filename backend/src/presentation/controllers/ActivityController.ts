// ActivityController.ts
import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { CreateActivityUseCase } from "../../application/usesCase/activity/CreateActivityUseCase";
import type { UpdateActivityUseCase } from "../../application/usesCase/activity/UpdateActivityUseCase";
import type { DeleteActivityUseCase } from "../../application/usesCase/activity/DeleteActivityUseCase";
import type { FindActivityByIdUseCase } from "../../application/usesCase/activity/FindActivityByIdUseCase";
import type { GetAllActivitiesUseCase } from "../../application/usesCase/activity/GetAllActivitiesUseCase";
 
import { CreateActivityDto } from "../../application/dtos/activity/CreateActivityDto";
import type { Request, Response } from 'express';
import { UpdateActivityDto } from "../../application/dtos/activity/UpdateActivityDto";
import type { FindActivitiesByArtist } from "../../application/usesCase/activity/FindActivitiesByArtist";
import type { AddArtistToActivityUseCase } from "../../application/usesCase/activity/AddArtistToActivityUseCase";
import { ArtistOnActivityDto } from "../../application/dtos/activity/ArtistOnActivityDto";
import type { FindActivitiesByGroupUseCase } from "../../application/usesCase/activity/FindActivitiesByGroupUseCase";

@injectable()
export class ActivityController {
  constructor(
    @inject(Types.CreateActivityUseCase) private createActivityUseCase: CreateActivityUseCase,
    @inject(Types.UpdateActivityUseCase) private updateActivityUseCase: UpdateActivityUseCase,
    @inject(Types.DeleteActivityUseCase) private deleteActivityUseCase: DeleteActivityUseCase,
    @inject(Types.FindActivityByIdUseCase) private findActivityByIdUseCase: FindActivityByIdUseCase,
    @inject(Types.GetAllActivitiesUseCase) private getAllActivitiesUseCase: GetAllActivitiesUseCase,
    @inject(Types.FindActivitiesByArtist) private findActivitiesByArtist: FindActivitiesByArtist,
    @inject(Types.AddArtistToActivityUseCase) private addArtistToActivity: AddArtistToActivityUseCase,
    @inject(Types.FindActivitiesByGroupUseCase) private findActivitiesByGroup:FindActivitiesByGroupUseCase

  ) {}

  async createActivity(req: Request, res: Response) {
    try {
      const activityDto = CreateActivityDto.Create(req.body);
      
      const activity = await this.createActivityUseCase.execute(activityDto);
      
      res.status(201).json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activity = await this.findActivityByIdUseCase.execute(id!);
      
      res.json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteActivityUseCase.execute(id!);
      
      res.json({
        success: true,
        message: 'Activity deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateDto = UpdateActivityDto.Create(req.body);
      const activity = await this.updateActivityUseCase.execute(id!, updateDto);
      
      res.json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const activities = await this.getAllActivitiesUseCase.execute();
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  async findByArtist(req: Request, res: Response) {
    try {
      
      const { apprenticeId,groupId } = req.params;
      const activities = await this.findActivitiesByArtist.execute({apprenticeId: Number(apprenticeId), groupId: Number(groupId)})
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async addArtist(req: Request, res: Response) {
    try {
      
      const dto=ArtistOnActivityDto.createToAdd(req.body)
      await this.addArtistToActivity.execute(dto)
      
      res.json({
        success: true,
        data: "Artist Linked to Activity"
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async findByGroup(req: Request, res: Response) {
    try {
      
      const { groupId } = req.params;
     
      const activities = await this.findActivitiesByGroup.execute(groupId!)
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}