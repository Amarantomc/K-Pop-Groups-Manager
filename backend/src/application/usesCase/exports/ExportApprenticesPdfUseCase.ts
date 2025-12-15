import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ListApprenticeUseCase } from "../apprentice/ListApprenticeUseCase";
import type { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { IExportable } from "../../interfaces/exports/IExportable";


@injectable()
export class ExportApprenticesPdfUseCase {
    constructor(
        @inject(Types.ListApprenticeUseCase) private apprentices:ListApprenticeUseCase ,
         
        @inject(Types.IExportable) private pdfExporter: IExportable<ApprenticeResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const apprentice= await this.apprentices.execute()
        
        return this.pdfExporter.export(apprentice, {
            title: 'Listado de Aprendices ',
            filename: `apprentice_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header:'Id', dataKey: 'id' },
                { header:'Nombre', dataKey: 'name' },
                { header:'Fecha Nacimiento', dataKey: 'dateOfBirth' },
                { header:'Edad', dataKey: 'age' },
                { header:'Nivel Entrenamiento', dataKey: 'trainingLv' },
                
                
                 

                
                 
            ]
        });
    }
}