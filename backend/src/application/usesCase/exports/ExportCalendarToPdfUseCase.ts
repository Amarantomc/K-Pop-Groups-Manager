import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { FindActivitiesByGroupUseCase } from "../activity/FindActivitiesByGroupUseCase";
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class ExportCalendarToPdfUseCase {
    constructor(
        @inject(Types.FindActivitiesByGroupUseCase) private artist: FindActivitiesByGroupUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ActivityResponseDto>
    ) {}

    async execute(groupId: string): Promise<Buffer> {
        const activities= await this.artist.execute(groupId)
         

        return this.pdfExporter.export(activities, {
            title: 'Listado de Actividades de Grupo',
            filename: `actividades_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
                { header:'Responsable', dataKey: 'responsible' },
                { header:'Tipo', dataKey: 'activityType' },
                { header:'Fecha', dataKey: 'date' },
                { header:'Lugar', dataKey: 'place' },
                 

                
                 
            ]
        });
    }
}