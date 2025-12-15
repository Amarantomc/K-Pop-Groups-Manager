import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ListConceptUseCase } from "../concept/ListConceptUSeCase";
import type { ConceptResponseDto } from "../../dtos/concept/ConceptResponseDto";

@injectable()
export class ExportConceptsPdfUseCase {
    constructor(
        @inject(Types.ListConceptUseCase) private concepts: ListConceptUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ConceptResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const concept = await this.concepts.execute();
        
        return this.pdfExporter.export(concept, {
            title: 'Listado de Conceptos',
            filename: `concepts_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header: 'Id', dataKey: 'id' },
                { header: 'Nombre', dataKey: 'name' },
                { header: 'Descripción', dataKey: 'description' }
            ]
        });
    }
}