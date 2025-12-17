import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ListGroupsUseCase } from "../group/ListGroupsUseCase";
 
import type { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";
import type { IExportable } from "../../interfaces/exports/IExportable";

@injectable()
export class ExportGroupsPdfUseCase {
    constructor(
        @inject(Types.ListGroupsUseCase) private groups:ListGroupsUseCase ,
         
        @inject(Types.IExportable) private pdfExporter: IExportable<GroupResponseDTO>
    ) {}

    async execute(): Promise<Buffer> {
        const group= await this.groups.execute()
        
        return this.pdfExporter.export(group, {
            title: 'Listado de Grupos ',
            filename: `group_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                
                { header:'Nombre', dataKey: 'name' },
                { header:'Fecha Debut', dataKey: 'debut' },
                { header:'No.Miembros', dataKey: 'memberCount' },
                { header:'Estado', dataKey: 'status' },
                
                
                 

                
                 
            ]
        });
    }
}