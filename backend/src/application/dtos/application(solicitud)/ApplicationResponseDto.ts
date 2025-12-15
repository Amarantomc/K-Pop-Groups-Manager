import Application from "../../../domain/entities/Application";

export class ApplicationResponseDto {
  constructor(
    public readonly id: number,
    public readonly groupName: string,
    public readonly date: Date | string,
    public readonly idConcept: number,
    public readonly roles: string[],
    public readonly idAgency: number,
    public readonly apprentices: {
      apprenticeId: number;
      name: string;
    }[],
    public readonly artists: {
      idApprentice: number;
      groupId: number;
      realName: string;
      artisticName: string;
    }[],
    public readonly status: string
  ) {}

  
  static fromEntity(application: Application): ApplicationResponseDto {
    return new ApplicationResponseDto(
      application.id,
      application.groupName,
      application.date,
      application.idConcept,
      application.roles,
      application.idAgency,
      application.apprentices,
      application.artists,
      application.status
    );
  }

  // ===============================
  // PERSISTENCE → DOMAIN
  // ===============================
  static toEntity(application: any): Application {
    return new Application({
      id: application.id,
      groupName: application.nombreGrupo,
      roles: application.roles,
      idConcept: application.idConcepto,
      idAgency: application.idAgencia,
      date: application.fechaSolicitud,
      status: application.estado,

      // 🔥 Aprendices → PROTOTIPO
      apprentices:
        application.AprendizMiembro?.map((a: any) => ({
          apprenticeId: a.id,
          name: a.nombreCompleto
        })) ?? [],

      // 🔥 Artistas → PROTOTIPO
      artists:
        application.ArtistaMiembro?.map((a: any) => ({
          idApprentice: a.idAp,
          groupId: a.idGr,
          realName: a.aprendiz?.nombreCompleto ?? "",
          artisticName: a.nombreArtistico
        })) ?? [],

      idVisualConcept: application.idConceptoVisual ?? 1
    });
  }

  static fromEntities(applications: Application[]): ApplicationResponseDto[] {
    return applications.map(app => this.fromEntity(app));
  }

  static toEntities(applications: any[]): Application[] {
    return applications.map(app => this.toEntity(app));
  }
}