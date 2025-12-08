import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IIncomeRepository } from "../../interfaces/repositories/IIncomeRepository";

@injectable()
export class DeleteIncomeUseCase {
  constructor(@inject(Types.IIncomeRepository) private incomeRepository: IIncomeRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(incomeId: string): Promise<void> {
    const income = await this.incomeRepository.findById(incomeId);

    if (!income) {
      throw new Error("Income not found");
    }

    await this.incomeRepository.delete(incomeId);
  }
}