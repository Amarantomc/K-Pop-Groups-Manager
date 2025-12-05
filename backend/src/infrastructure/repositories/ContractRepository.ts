import { inject, injectable } from "inversify";
import type { CreateContractDto } from "../../application/dtos/contract/CreateContractDto";
import type { IContractRepository } from "../../application/interfaces/repositories/IContractRepository";
import type { Contract } from "../../domain";
import { Types } from "../di/Types";
import type { IUnitOfWork } from "../../application/interfaces/IUnitOfWork";
import { ContractResponseDto } from "../../application/dtos/contract/ContractResponseDto";

@injectable()
export class ContractRepository implements IContractRepository{
    
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

       private get db() {
    return this.unitOfWork.getTransaction();
  }
    
    

    async create(data: CreateContractDto): Promise<Contract> {
        let contract;
        if (data.type === 'Artist') {
        contract = await this.db.contrato.create({
        data: {
          idAg: data.agencyId,
          idAp: data.apprenticeId!,
          idGr: data.groupId!,
          fechaInicio: new Date(data.startDate),
          fechaFinalizacion: data.completionDate ? new Date(data.completionDate) : null,
          estado: data.status,
          condicionesIniciales: data.initialConditions,
          distribucionIngresos: data.incomeDistribution
        },
        include: {
          Agencia: true,
          Artista: true
        }
      });

       
    } else {
       contract = await this.db.contratoGrupo.create({
        data: {
          idAg: data.agencyId,
          IdGr: data.groupId,
          fechaInicio: new Date(data.startDate),
          fechaFinalizacion: data.completionDate ? new Date(data.completionDate) : null,
          estado: data.status,
          condicionesIniciales: data.initialConditions,
          distribucionIngresos: data.incomeDistribution
        },
        include: {
          Agencia: true,
          Grupo: true
        }
      });

      
    }
       
    return ContractResponseDto.toEntity(contract,data.type)
  }

    findById(id: string): Promise<Contract | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: any): Promise<Contract> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

        findAll(): Promise<Contract[]> {
        throw new Error("Method not implemented.");
    }

}