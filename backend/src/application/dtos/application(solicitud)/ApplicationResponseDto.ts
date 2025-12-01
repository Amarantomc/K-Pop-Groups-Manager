import type { Prisma } from "@prisma/client";
import { Application } from "../../../domain";
import type { Artist } from "../../../domain/entities/Artist";

export class ApplicationResponseDto{
    constructor(
        public readonly id:number,
        public readonly description:string,
        public readonly date:Date,
    ){}

    static fromEntity(apprendice: any): ApplicationResponseDto {
        return new ApplicationResponseDto(
            apprendice.id,
            apprendice.descripcion,
            apprendice.fechaSolicitud,
        );
      }

      static toEntity(application: any): Application {
        return new Application({
          id: application.id,
          description: application.descripcion,
          date: application.fechaSolicitud,
          apprentices: application.SolicitudGrupoAprendiz,
          artists: application.SolicitudGrupoArtista
        });
      }

      static fromEntities(applications: any[]): ApplicationResponseDto[] {
        return applications.map(application => this.fromEntity(application));
      }

      static toEntities(applications: any[]): Application[] {
              return applications.map(application => this.toEntity(application));
            }
}
