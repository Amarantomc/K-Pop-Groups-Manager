import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { IncomeResponseDto } from "../../dtos/income/IncomeResponseDto";
import type { CreateIncomeDto } from "../../dtos/income/CreateIncomeDto";
import type { IIncomeRepository } from "../../interfaces/repositories/IIncomeRepository";


@injectable()
export class CreateIncomeUseCase{

    constructor(
    @inject(Types.IIncomeRepository) private incomeRepository: IIncomeRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateIncomeDto):Promise<IncomeResponseDto>{
        try
        {
            await this.unitOfWork.beginTransaction();
            const income = await this.incomeRepository.create(command);
            await this.unitOfWork.commit();
            
            return new IncomeResponseDto(
                income.idIncome,
                income.idActivity,
                income.description,
                income.amount,
                new Date(income.date)
            );
        }
        catch(error){
            console.log(error);
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}