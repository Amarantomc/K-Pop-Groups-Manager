import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ListApplicationUseCase } from "../application(solicitud)/ListApplicationUseCase";
import type { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";

@injectable()
export class ExportApplicationsPdfUseCase {
    constructor(
        @inject(Types.ListApplicationUseCase) private applications: ListApplicationUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ApplicationResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const application = await this.applications.execute();
        
        return this.pdfExporter.export(application, {
            title: 'Listado de Solicitudes',
            filename: `applications_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                
                { header: 'Nombre Grupo', dataKey: 'groupName' },
                { header: 'Estado', dataKey: 'status' },
                { header: 'Fecha Solicitud', dataKey: 'date' },
                { header: 'Id Agencia', dataKey: 'idAgency' },
                { header: 'Roles', dataKey: 'roles' }
            ]
        });
    }
}