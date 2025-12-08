import { Application } from "../../../domain";

export class ApplicationResponseDto{
    constructor(
      public readonly id:number,
      public readonly groupName:string,
      public readonly date:Date | string,
      public readonly idConcept:number,
      public readonly roles: string[],
      public readonly idAgency: number,
      public readonly apprentices: number[],
      public readonly artis:[number,number][],
      public readonly estado: string,
    ){}

    static fromEntity(application: any): ApplicationResponseDto {
      return new ApplicationResponseDto(
        application.id,
        application.nombreGrupo,
        application.fechaSolicitud,  // date
        application.idConcepto,      // idConcept
        application.roles,           // roles
        application.idAgencia,       // idAgency
        application.apprentices,
        application.artists,
        application.estado
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
          apprentices: application.apprentices,
          artists:application.artists,
          estado: application.estado
        });
      }

      static fromEntities(applications: any[]): ApplicationResponseDto[] {
        return applications.map(application => this.fromEntity(application));
      }

      static toEntities(applications: any[]): Application[] {
              return applications.map(application => this.toEntity(application));
            }
}
