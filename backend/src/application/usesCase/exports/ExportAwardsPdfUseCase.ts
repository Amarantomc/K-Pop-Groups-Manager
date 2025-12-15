import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ListAwardUseCase } from "../award/ListAwardUseCase";
import type { AwardResponseDto } from "../../dtos/award/AwardResposeDto";

@injectable()
export class ExportAwardsPdfUseCase {
    constructor(
        @inject(Types.ListAwardUseCase) private awards: ListAwardUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<AwardResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const award = await this.awards.execute();
        
        return this.pdfExporter.export(award, {
            title: 'Listado de Premios',
            filename: `awards_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header: 'Id', dataKey: 'id' },
                { header: 'Nombre', dataKey: 'awardTitle' },
                { header: 'Academia', dataKey: 'academyName' },
                
            ]
        });
    }
}