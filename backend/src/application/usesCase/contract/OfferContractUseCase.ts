import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class OfferContractUseCase {
  constructor(
    @inject(Types.IContractRepository)
    private readonly contractRepository: IContractRepository,
    @inject(Types.IUnitOfWork)
    private readonly unitOfWork: UnitOfWork
  ) {}

  async execute(): Promise<ArtistResponseDto[]> {
    try {
      await this.unitOfWork.beginTransaction();

      const artists = await this.contractRepository.offerContract();

      await this.unitOfWork.commit();

      return ArtistResponseDto.fromEntities(artists);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}