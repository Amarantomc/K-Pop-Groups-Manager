import type { Album } from "../../../domain";

export class CreateAwardDto {
    constructor(
      public readonly awardTitle: string,
      public readonly academyName: string,
      //public readonly albums?: Album[]
    ) {}
  
    static create(body: any): CreateAwardDto {
      if (!body.academyName || !body.awardTitle ) {
        throw new Error('Missing required fields');
      }
  
  
      return new CreateAwardDto(
        body.awardTitle,
        body.academyName,
      );
    }
  }