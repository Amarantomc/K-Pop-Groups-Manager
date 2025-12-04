import { Award, type Album } from "../../../domain";

export class AwardResponseDto {
  constructor(
    public readonly id: number,
    public readonly academyName: string,
    public readonly awardTitle: string,
    public readonly albums?: Album[],
  ) {}

  static fromEntity(award: Award): AwardResponseDto {
    return new AwardResponseDto(
      award.id,
      award.academyName,
      award.awardTitle,
      award.albums
    );
  }

static toEntity(award: any): Award {
        return new Award({
          id: award.id,
          awardTitle: award.tituloPremio,
          academyName: award.nombreAcademia,
          albums: award.Albums,
        });
      }

  static fromEntities(awards: Award[]): AwardResponseDto[] {
    return awards.map(award => this.fromEntity(award));
  }

  static toEntities(awards: any[]): Award[] {
    return awards.map(award => this.toEntity(award));
  }
}