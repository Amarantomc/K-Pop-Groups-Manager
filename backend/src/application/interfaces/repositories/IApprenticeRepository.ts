import type { Apprentice } from "../../../domain";
import type { CreateApprenticeDto } from "../../dtos/apprentice/CreateApprenticeDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IApprenticeRepository extends IBaseRepository<Apprentice,CreateApprenticeDto,any> {
    findAll(): Promise<Apprentice[]>;
    listByAgency(id:number): Promise<Apprentice[]>;
    findByName(name:string):Promise<Apprentice|null>;
    addEvaluation(apprenticeId:number,agencyId: number,evaluation: number,date: Date ):Promise<void>;

}

 