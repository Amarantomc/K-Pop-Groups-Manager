import type { Apprentice } from "../../../domain";
import type ApprenticeEvaluation from "../../../domain/entities/ApprenticeEvaluation";
import type { CreateApprenticeDto } from "../../dtos/apprentice/CreateApprenticeDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IApprenticeRepository extends IBaseRepository<Apprentice,CreateApprenticeDto,any> {
    findAll(): Promise<Apprentice[]>;
    listByAgency(id:number): Promise<Apprentice[]>;
    findByName(name:string):Promise<Apprentice|null>;
    addEvaluation(apprenticeId:number,agencyId: number,evaluation: number,date: Date ):Promise<void>;
    apprenticeScout():Promise<Apprentice[]>;
    attractApprentice(apprenticeId:number,agencyId: number): Promise<void>;
    apprenticeScout():Promise<Apprentice[]>;
    getAllEvaluations(apprenticeId:number):Promise<ApprenticeEvaluation[]>;

}

 