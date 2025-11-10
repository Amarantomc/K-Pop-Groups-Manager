import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";

export class DeleteApprenticeUseCase {
  constructor(private apprenticeRepository: IApprenticeRepository) {}

  async execute(apprenticeId: string): Promise<void> {
    const apprentice = await this.apprenticeRepository.findById(apprenticeId);

    if (!apprentice) {
      throw new Error("Apprentice not found");
    }

    await this.apprenticeRepository.delete(apprenticeId);
  }
}