import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IIncomeRepository } from "../../interfaces/repositories/IIncomeRepository";
import { IncomeResponseDto } from "../../dtos/income/IncomeResponseDto";

@injectable()
export class GetIncomeUseCase{
    constructor(@inject(Types.IIncomeRepository) private incomeRepository: IIncomeRepository){}

    async excute(incomeId:string): Promise<IncomeResponseDto> {

            const income = await this.incomeRepository.findById(incomeId);
            if(!income)
            {
                throw new Error('Income not found');
            }

            return new IncomeResponseDto(income.idIncome, income.idActivity, income.description,income.amount,new Date(income.date));
    }
}