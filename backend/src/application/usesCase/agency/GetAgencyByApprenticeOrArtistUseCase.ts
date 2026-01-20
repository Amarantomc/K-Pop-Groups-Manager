import { inject, injectable } from "inversify";
import type { Agency } from "../../../domain/entities/Agency";
import { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class GetAgencyByApprenticeOrArtistUseCase {
  constructor(
    @inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(apprenticeId: number, groupId?: number): Promise<AgencyResponseDTO> {
    try {
      await this.unitOfWork.beginTransaction();

      const agency: Agency = await this.agencyRepository.getAgencyByApprenticeOrArtist(apprenticeId,groupId);

      // Si no se encuentra agencia (por seguridad)
      if (!agency) {
        throw new Error(
          `No se encontró ninguna agencia activa para el aprendiz con id ${apprenticeId}${groupId ? ` y el grupo con id ${groupId}` : ""}`
        );
      }

      // Commit de la transacción
      await this.unitOfWork.commit();

      // Retornamos el DTO
      return AgencyResponseDTO.fromEntity(agency);
    } catch (error) {
      await this.unitOfWork.commit(); // o rollback si tu implementación lo requiere
      throw error;
    }
  }
}