import  { Artist } from "../../../domain/entities/Artist";
 

export class ArtistResponseDto {
  constructor(
    public readonly ApprenticeId: number,
    public readonly GroupId: number,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string,
    public readonly groupHistory?: Array<{
      groupId: number;
      role: string;
      startDate: string;
      endDate?: string;
    }>,
    public readonly contracts?: Array<{
      agencyId: number;
      startDate: string;
      endDate?: string;
      status: string;
    }>,
    public readonly activities?: Array<{
      activityId: number;
      accepted: boolean;
    }>
    
  ) {}

  static fromEntity(artist: Artist): ArtistResponseDto {
    return new ArtistResponseDto(
      artist.ApprenticeId,
      artist.GroupId,
      artist.ArtistName,
      artist.DebutDate.toDateString(),
      artist.Status.toString(),
       
      
    );
  }

  static toEntity(artist:any):Artist {
    return new Artist({ 
      ApprenticeId:artist.idAp,
      GroupId:artist.idGr,
      ArtistName:artist.nombreArtistico,
      DebutDate: artist.fsechaDebut,
      Status:artist.estadoArtista,
 
      }
     
    )
  }

  static fromEntities(artists: any[]): ArtistResponseDto[] {
    return artists.map(artist => this.fromEntity(artist));
  }

   static toEntities(artists: any[]): Artist[] {
    return artists.map(artist => this.toEntity(artist));
  }
}