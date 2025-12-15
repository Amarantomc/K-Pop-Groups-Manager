import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { GetUsersUseCase } from "../user/GerUsersUseCase";
import type { UserResponseDto } from "../../dtos/user/UserResponseDto";

@injectable()
export class ExportUsersPdfUseCase {
    constructor(
        @inject(Types.GetUsersUseCase) private users: GetUsersUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<UserResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const user = await this.users.execute();
        
        return this.pdfExporter.export(user, {
            title: 'Listado de Usuarios',
            filename: `users_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header: 'Id', dataKey: 'id' },
                { header: 'Nombre', dataKey: 'name' },
                { header: 'Email', dataKey: 'email' },
                { header: 'Rol', dataKey: 'role' },
                
            ]
        });
    }
}