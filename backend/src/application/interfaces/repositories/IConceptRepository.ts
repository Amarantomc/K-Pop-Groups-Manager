import type { Concept } from "../../../domain";
import type { CreateConceptDto } from "../../dtos/concept/CreateConceptDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IConceptRepository extends IBaseRepository<Concept,CreateConceptDto,any> {
    findAll(): Promise<Concept[]>;
}
