// UpdateActivityDto.ts
import { ActivityTypes } from "../../../domain/enums/ActivityType";

export class UpdateActivityDto {
  constructor(
    public readonly responsible?: string,
    public readonly activityType?: string,
    public readonly date?: string,
    public readonly place?: string,
    public readonly eventType?:string
  ) {}

  static Create(body: any): UpdateActivityDto {
    if (body.activityType && !(body.activityType in ActivityTypes)) {
      throw new Error('Invalid Activity Type');
    }

    return new UpdateActivityDto(
      body.responsible,
      body.activityType,
      body.date,
      body.place,
      body.eventType
    );
  }
}