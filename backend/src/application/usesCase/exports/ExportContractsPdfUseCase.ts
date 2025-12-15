import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { GetAllContractUseCase } from "../contract/GetAllContractUseCase";
import type { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";

@injectable()
export class ExportContractsPdfUseCase {
    constructor(
        @inject(Types.GetAllContractsUseCase) private contracts: GetAllContractUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ContractResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const contract = await this.contracts.execute();
        
        return this.pdfExporter.export(contract, {
            title: 'Listado de Contratos',
            filename: `contracts_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header: 'Tipo', dataKey: 'type' },
                { header: 'Fecha Inicio', dataKey: 'startDate' },
                { header: 'Fecha Fin', dataKey: 'completionDate' },
                { header: 'Condiciones Iniciales', dataKey: 'initialConditions' },
                { header: 'Distribucion Ingresos', dataKey: 'incomeDistribution' },
                { header: 'Estado', dataKey: 'status' }
            ]
        });
    }
}