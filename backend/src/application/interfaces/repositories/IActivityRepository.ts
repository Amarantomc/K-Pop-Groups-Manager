// IActivityRepository.ts
import type { Activity } from "../../../domain/entities/Activity";
import type { CreateActivityDto } from "../../dtos/activity/CreateActivityDto";
import type { UpdateActivityDto } from "../../dtos/activity/UpdateActivityDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IActivityRepository extends IBaseRepository<Activity, CreateActivityDto, Partial<UpdateActivityDto>> {
  getAll(): Promise<Activity[]>;
//   findByType(type: string): Promise<Activity[]>;
//   findByDate(date: Date): Promise<Activity[]>;
//   findByResponsible(responsible: string): Promise<Activity[]>;
  
//   // Métodos para artistas en actividades
//   addArtist(activityId: number, apprenticeId: number, groupId: number, accepted: boolean): Promise<void>;
//   removeArtist(activityId: number, apprenticeId: number, groupId: number): Promise<void>;
//   getArtists(activityId: number): Promise<Array<{ apprenticeId: number; groupId: number; accepted: boolean }>>;
  
//   // Métodos para ingresos
//   addIncome(activityId: number, amount: number, description: string, date: Date): Promise<void>;
//   getIncome(activityId: number): Promise<any>;
}