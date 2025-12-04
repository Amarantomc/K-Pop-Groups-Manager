import type { VisualConcept } from "../../../domain";
import type { CreateVisualConceptDto } from "../../dtos/visualConcept/CreateVisualConceptDto";
import type { IBaseRepository } from "./IBaseRepository";

export interface IVisualConceptRepository extends IBaseRepository<VisualConcept,CreateVisualConceptDto,any> {
    findAll(): Promise<VisualConcept[]>;
}
