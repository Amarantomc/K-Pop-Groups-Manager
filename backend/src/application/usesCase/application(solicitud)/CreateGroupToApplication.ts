import type { Application } from "../../../domain";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";


@injectable()
export class CreateGroupApplicationUseCase{

    constructor(
    @inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateApplicationDto):Promise<void>{

        
     }}