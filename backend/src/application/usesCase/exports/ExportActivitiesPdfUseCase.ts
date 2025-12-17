import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { GetAllActivitiesUseCase } from "../activity/GetAllActivitiesUseCase";
import type { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class ExportActivitiesPdfUseCase {
    constructor(
        @inject(Types.GetAllActivitiesUseCase) private activities: GetAllActivitiesUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ActivityResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const activity = await this.activities.execute();
        
        return this.pdfExporter.export(activity, {
            title: 'Listado de Actividades',
            filename: `activities_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                
                { header: 'Responsable', dataKey: 'responsible' },
                { header: 'Tipo', dataKey: 'activityType' },
                { header: 'Fecha', dataKey: 'date' },
                { header: 'Lugar', dataKey: 'place' }
            ]
        });
    }
}