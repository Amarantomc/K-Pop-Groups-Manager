import type { Contract } from "../../../domain";
import type { CreateContractDto } from "../../dtos/contract/CreateContractDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IContractRepository extends IBaseRepository<Contract,CreateContractDto,any>{
    findAll(): Promise<Contract[]>;
    
}