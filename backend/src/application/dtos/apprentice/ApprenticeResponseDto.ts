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
        public readonly status: string | Status,
        
    ){}

    static fromEntity(apprentice: Apprentice): ApprenticeResponseDto {
        return new ApprenticeResponseDto(
            apprentice.id,
            apprentice.name,
            apprentice.dateOfBirth,
            apprentice.age,
            apprentice.trainingLv,
            apprentice.status
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

      static toEntities(apprentices: any[]): Apprentice[] {
        return apprentices.map(apprentice => this.toEntity(apprentice));
      }
}
