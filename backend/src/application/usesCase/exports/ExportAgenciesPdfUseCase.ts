import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
 
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
 
 
import type { ListAgenciesUseCase } from "../agency/ListAgenciesUseCase";
import type { AgencyResponseDTO } from "../../dtos/agency/AgencyResponseDTO";

@injectable()
export class ExportAgenciesPdfUseCase {
    constructor(
        @inject(Types.ListAgenciesUseCase) private agencies:ListAgenciesUseCase ,
         
        @inject(Types.IExportable) private pdfExporter: IExportable<AgencyResponseDTO>
    ) {}

    async execute(): Promise<Buffer> {
        const agencies= await this.agencies.execute()
        
        return this.pdfExporter.export(agencies, {
            title: 'Listado de Agencias ',
            filename: `agencies_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                
                { header:'Nombre', dataKey: 'name' },
                { header:'Direccion', dataKey: 'address' },
                { header:'Fecha de Fundacion', dataKey: 'foundation' },
                
                 

                
                 
            ]
        });
    }
}