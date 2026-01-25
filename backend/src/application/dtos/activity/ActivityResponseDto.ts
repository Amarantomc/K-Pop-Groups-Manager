// ActivityResponseDto.ts
import { Activity } from "../../../domain/entities/Activity";
import { Artist } from "../../../domain/entities/Artist";
import type { ArtistStatus } from "../../../domain/enums/ArtistStatus";

export class ActivityResponseDto {
  constructor(
    public readonly id: number,
    public readonly responsible: string,
    public readonly activityType: string | null,
    public readonly date: string | null,
    public readonly place: string,
    public readonly eventType: string,
    public readonly status:string,
    public readonly artists?: Array<{
      apprenticeId: number;
      groupId: number;
      artistName: string;
    }>,
    public readonly incomes?: {
      idIncome: number;
      amount: number;
      type: string;
      date: Date;
    }[]
  ) {}

  static fromEntity(activity: Activity): ActivityResponseDto {
    return new ActivityResponseDto(
      activity.id,
      activity.responsible,
      activity.activityType ?? null,
      activity.date ? activity.date.toISOString() : null,
      activity.place,
      activity.eventType,
      activity.status,
  
      // ARTISTAS
      activity.artists?.map(a => ({
        apprenticeId: a.apprenticeId,
        groupId: a.groupId,
        artistName: a.artistName
      })) ?? [],
  
      // INGRESOS
      activity.incomes?.map(i => ({
        idIncome: i.idIncome,
        amount: i.amount,
        type: i.type,
        date: i.date,
      })) ?? []
    );
  }

  static toEntity(activity: any): Activity {
    // ARTISTAS desde PersonasEnActividad
    const artists: Array<{
      apprenticeId: number;
      groupId: number;
      artistName: string;
    }> =
      activity.Personas
        ?.filter((p: any) => p.artista)
        .map((p: any) => ({
          apprenticeId: p.artista.idAp,
          groupId: p.artista.idGr,
          artistName: p.artista.nombreArtistico
        })) ?? [];
  
    // INGRESOS
    const incomes =
      activity.Ingreso?.map((i: any) => ({
        idIncome: i.idIng,
        amount: Number(i.monto),
        type: i.descripcion,
        date: i.fecha
      })) ?? [];
  
    return new Activity({
      id: activity.id,
      responsible: activity.responsable,
      activityType: activity.tipoActividad,
      date: activity.fecha,
      place: activity.lugar,
      eventType: activity.tipoEvento,
      status: activity.estado,
      artists,
      incomes
    });
  }


  // static toEntity(activity: any): Activity {
  //   return new Activity({
  //     id: activity.id,
  //     responsible: activity.responsable,
  //     activityType: activity.tipoActividad,
  //     eventType: activity.tipoEvento,
  //     date: activity.fecha,
  //     place: activity.lugar,
  //     status: activity.estado,
  
  //     artists: activity.Personas
  //       ?.filter((p: { idAp: any; }) => p.idAp)
  //       .map((p: { Aprendiz: { id: any; nombreCompleto: any; }; idGr: any; }) => ({
  //         id: p.Aprendiz.id,
  //         name: p.Aprendiz.nombreCompleto,
  //         groupId: p.idGr,
  //       })) ?? [],
  
  //     incomes: [],
  //   });
  // }

  static fromEntities(activities: Activity[]): ActivityResponseDto[] {
    return activities.map(activity => this.fromEntity(activity));
  }

  static toEntities(activities: any[]): Activity[] {
    return activities.map(activity => this.toEntity(activity));
  }
}