import type { Album } from "../../../domain";

export class UpdateAwardDto {
  constructor(
    public readonly awardTitle?: string,
    public readonly academyName?: string,
    //public readonly albums?: Album[]
  ) {}

  static create(body: any): UpdateAwardDto {

    return new UpdateAwardDto(
      body.awardTitle,
      body.academyName,
      //body.albums
    );
  }
}