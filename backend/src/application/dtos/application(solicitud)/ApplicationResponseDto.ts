import { Application } from "../../../domain";

export class ApplicationResponseDto{
    constructor(
      public readonly id:number,
      public readonly groupName:string,
      public readonly date:Date | string,
      public readonly idConcept:number,
      public readonly roles: string[],
      public readonly idAgency: number,
      public readonly apprentices?: number[],
      public readonly artists?:[number,number][],
      public readonly status?: string,
    ){}

    static fromEntity(application: Application): ApplicationResponseDto {
      //console.log(application);
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

    static toEntity(application: any): Application {

      return new Application({
        id: application.id,
        groupName: application.nombreGrupo,
        roles: application.roles,
        idConcept: application.idConcepto,
        idAgency: application.idAgencia,
        date: application.fechaSolicitud,
        status: application.estado,
    
        // AprendizMiembro → array de IDs
        apprentices: application.AprendizMiembro?.map((a: any) => a.id) ?? [],
    
        // ArtistaMiembro → array de tuplas [idAp, idGr]
        artists: application.ArtistaMiembro?.map((a: any) => [a.idAp, a.idGr]) ?? [],
    
        // tu schema NO guarda esto en Solicitud → default a 1
        idVisualConcept: application.idConceptoVisual ?? 1
      });
    }

      static fromEntities(applications: any[]): ApplicationResponseDto[] {
        //console.log(applications);
        return applications.map(application => this.fromEntity(application));
      }

      static toEntities(applications: any[]): Application[] {
              return applications.map(application => this.toEntity(application));
            }
}
