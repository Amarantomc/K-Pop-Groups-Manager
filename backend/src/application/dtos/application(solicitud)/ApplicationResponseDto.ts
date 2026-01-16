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
      rol: string;
      status:string;
    }[],
    public readonly artists: {
      idApprentice: number;
      groupId: number;
      realName: string;
      artisticName: string;
      rol: string;
      status:string;
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
  
      // APRENDICES CON ROL Y STATUS
      application.apprentices.map(a => ({
        apprenticeId: a.apprenticeId,
        name: a.name,
        rol: a.rol,
        status: a.status,
      })),
  
      // ARTISTAS CON ROL Y STATUS
      application.artists.map(a => ({
        idApprentice: a.idApprentice,
        groupId: a.groupId,
        realName: a.realName,
        artisticName: a.artisticName,
        rol: a.rol,
        status: a.status,
      })),
  
      application.status
    );
  }

  static toEntity(application: any): Application {
    return new Application({
      id: application.id,
      groupName: application.nombreGrupo,
      roles: application.roles,
      idConcept: application.idConcepto,
      idAgency: application.idAgencia,
      date: application.fechaSolicitud,
      status: application.estado,
  
      // APRENDICES CON ROL Y STATUS
     // APRENDICES CON ROL Y STATUS (desde aprendiz)
      apprentices:
      application.SolicitudGrupoAprendiz?.map((s: any) => ({
        apprenticeId: s.idAp,
        name: s.aprendiz?.nombreCompleto ?? "",
        rol: s.rol,
        status: s.estado,
      })) ?? [],
  
      // ARTISTAS CON ROL Y STATUS (desde artista)
      artists:
      application.SolicitudGrupoArtista?.map((s: any) => ({
        idApprentice: s.idAp,
        groupId: s.idGr,
        realName: s.artista?.aprendiz?.nombreCompleto ?? "",
        artisticName: s.artista?.nombreArtistico ?? "",
        rol: s.rol,
        status: s.estado,
      })) ?? [],
  
      idVisualConcept: application.idConceptoVisual ?? 1,
    });
  }

  static fromEntities(applications: Application[]): ApplicationResponseDto[] {
    return applications.map(app => this.fromEntity(app));
  }

  static toEntities(applications: any[]): Application[] {
    return applications.map(app => this.toEntity(app));
  }
}