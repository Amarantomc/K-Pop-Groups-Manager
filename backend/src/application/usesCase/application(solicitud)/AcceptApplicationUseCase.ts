import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { Application } from "../../../domain";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";

@injectable()
export class AcceptApplicationUseCase{
    constructor(@inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository){}

    async excute(applicationId:string): Promise<ApplicationResponseDto> {
        throw new Error("not implemented");
    }
}