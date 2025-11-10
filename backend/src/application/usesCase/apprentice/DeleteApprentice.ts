import { inject, injectable } from "inversify";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class DeleteApprenticeUseCase {
  constructor(@inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(apprenticeId: string): Promise<void> {
    const apprentice = await this.apprenticeRepository.findById(apprenticeId);

    if (!apprentice) {
      throw new Error("Apprentice not found");
    }

    await this.apprenticeRepository.delete(apprenticeId);
  }
}