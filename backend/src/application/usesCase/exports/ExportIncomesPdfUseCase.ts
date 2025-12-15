import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ListIncomeUseCase } from "../income/ListIncomeUseCase";
import type { IncomeResponseDto } from "../../dtos/income/IncomeResponseDto";

@injectable()
export class ExportIncomesPdfUseCase {
    constructor(
        @inject(Types.ListIncomeUseCase) private incomes: ListIncomeUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<IncomeResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const income = await this.incomes.execute();
        
        return this.pdfExporter.export(income, {
            title: 'Listado de Ingresos',
            filename: `incomes_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header: 'Id', dataKey: 'idIncome' },
                
                { header: 'Monto', dataKey: 'amount' },
                { header: 'Fecha', dataKey: 'date' },
                { header: 'Descripción', dataKey: 'description' }
            ]
        });
    }
}