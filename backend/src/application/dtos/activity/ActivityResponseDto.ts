// ActivityResponseDto.ts
import { Activity } from "../../../domain/entities/Activity";
import { Artist } from "../../../domain/entities/Artist";
import  Income from "../../../domain/entities/Income";
import type { ArtistStatus } from "../../../domain/enums/ArtistStatus";
import type { ArtistRoutes } from "../../../presentation/routes/ArtistRoutes";

export class ActivityResponseDto {
  constructor(
    public readonly id: number,
    public readonly responsible: string,
    public readonly activityType: string,
    public readonly date: string,
    public readonly place: string,
    public readonly eventType: string,
    public readonly artists?: Array<{
      apprenticeId: number;
      groupId: number;
      artistName: string;
    }>,
    public readonly income?: {
      idIncome: number;
      amount: number;
      type: string;
      date: string;
    }
  ) {}

  static fromEntity(activity: Activity): ActivityResponseDto {
    return new ActivityResponseDto(
      activity.id,
      activity.responsible,
      activity.activityType.toString(),
      activity.date.toDateString(),
      activity.place,
      activity.eventType,
    );
  }

  static toEntity(activity: any): Activity {
    let artista : Artist []=[]
    //let ingreso =null
    if(activity.Artista){
      artista= activity.Artista.map((a: { idAp: any; idGr: any; nombreArtistico: any; fechaDebut: any; estadoArtista: ArtistStatus; }) => new Artist({ApprenticeId:a.idAp,
        GroupId:a.idGr,
        ArtistName:a.nombreArtistico,
        DebutDate:a.fechaDebut,
        Status:a.estadoArtista as ArtistStatus}))
    }

    
    return new Activity({
      id: activity.id,
      responsible: activity.responsable,
      activityType: activity.tipoActividad,
      date: activity.fecha,
      place: activity.lugar,
      eventType: activity.tipoEvento,
      artists:artista ? artista : [],
    
    });
  }

  static fromEntities(activities: Activity[]): ActivityResponseDto[] {
    return activities.map(activity => this.fromEntity(activity));
  }

  static toEntities(activities: any[]): Activity[] {
    return activities.map(activity => this.toEntity(activity));
  }
}