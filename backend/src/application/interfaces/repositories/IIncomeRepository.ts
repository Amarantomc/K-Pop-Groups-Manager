import type { Income } from "../../../domain";
import type { CreateIncomeDto } from "../../dtos/income/CreateIncomeDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IIncomeRepository extends IBaseRepository<Income,CreateIncomeDto,any> {
    findAll(): Promise<Income[]>;
}
