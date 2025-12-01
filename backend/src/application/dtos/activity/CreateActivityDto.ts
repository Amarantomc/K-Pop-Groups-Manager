// CreateActivityDto.ts
import { ActivityTypes } from "../../../domain/enums/ActivityType";

export class CreateActivityDto {
  constructor(
    public readonly responsible: string,
    public readonly activityType: string,
    public readonly date: string,
    public readonly place: string
  ) {}

  static Create(body: any): CreateActivityDto {
    if (!body.responsible || !body.activityType || !body.date || !body.place) {
      throw new Error('Missing required fields');
    }

    if (!(body.activityType in ActivityTypes)) {
      throw new Error('Invalid Activity Type');
    }

    return new CreateActivityDto(
      body.responsible,
      body.activityType,
      body.date,
      body.place
    );
  }
}