import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAwardRepository } from "../../interfaces/repositories/IAwardRepository";

@injectable()
export class DeleteAwardUseCase {
  constructor(@inject(Types.IAwardRepository) private AwardRepository: IAwardRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(awardId: string): Promise<void> {
    const award = await this.AwardRepository.findById(awardId);

    if (!award) {
      throw new Error("Award not found");
    }

    await this.AwardRepository.delete(awardId);
  }
}