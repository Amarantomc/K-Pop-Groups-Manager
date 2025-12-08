import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IIncomeRepository } from "../../interfaces/repositories/IIncomeRepository";
import type { CreateIncomeDto } from "../../dtos/income/CreateIncomeDto";
import { IncomeResponseDto } from "../../dtos/income/IncomeResponseDto";

@injectable()
export class UpdateIncomeUseCase {
  constructor(@inject(Types.IIncomeRepository) private incomeRepository: IIncomeRepository) {}

  async execute(
    incomeId: string,
    data: Partial<CreateIncomeDto>
  ): Promise<IncomeResponseDto> {

    const income = await this.incomeRepository.findById(incomeId);

    if (!income) {
      throw new Error("Income not found");
    }

    const updatedIncome = await this.incomeRepository.update(incomeId, data);

    return new IncomeResponseDto(
      updatedIncome.idIncome,
      updatedIncome.idActivity,
      updatedIncome.description,
      updatedIncome.amount,
      new Date(updatedIncome.date)
    );
  }
}