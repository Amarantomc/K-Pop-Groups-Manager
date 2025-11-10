import type { Prisma } from "@prisma/client";
import { Apprentice } from "../../../domain";
import type { Status } from "../../../domain/enums/ApprenticeStatus";

export class ApprenticeResponseDto{
    constructor(
        public readonly id:number,
        public readonly name:string,
        public readonly dateOfBirth:Date,
        public readonly age: number,
        public readonly trainingLv: number,
        public readonly status: string | Status
    ){}

    static fromEntity(apprendice: any): ApprenticeResponseDto {
        return new ApprenticeResponseDto(
            apprendice.id,
            apprendice.name,
            apprendice.dateOfBirth,
            apprendice.age,
            apprendice.trainingLv,
            apprendice.status,
        );
      }

      static toEntity(apprentice: any): Apprentice {
        return new Apprentice(
            {id:apprentice.id,
            name:apprentice.nombreCompleto,
            dateOfBirth:apprentice.fechaNacimiento,
            age:apprentice.edad,
            trainingLv:apprentice.nivelEntrenamiento,
            status:apprentice.estadoAprendiz,}
        );
      }

      static fromEntities(apprentices: any[]): ApprenticeResponseDto[] {
        return apprentices.map(apprentice => this.fromEntity(apprentice));
      }
}
