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

  async findById(idC: any): Promise<Contract | null> {
        let {agencyId,apprenticeId,groupId,startDate,id}=idC
        
        
        let contract
        if(!apprenticeId){
            id=Number(id) 
          contract =await this.db.contratoGrupo.findUnique({
            where:{id},
            include: {
              Agencia: true,
              Grupo:true
            }
        })
     } else {
          contract=await this.db.contrato.findUnique({
         where:{idAg_idAp_idGr_fechaInicio:{
            idAg: Number (agencyId),
            idAp: Number (apprenticeId),
            idGr: Number (groupId),
            fechaInicio: new Date(startDate)
         }
         },
          include:{
            Agencia:true,
            Artista:true
          }
      })
     }  
      
       return contract? ContractResponseDto.toEntity(contract,!apprenticeId? "Group":"Artist") :null

  }
  async  update(idC: any, data: Partial<Contract>): Promise<Contract> {
        let {agencyId,apprenticeId,groupId,startDate,id}=idC
        let contract
        if(!apprenticeId){
          id=Number(id) 
          contract =await this.db.contratoGrupo.update({
            where:{id},
            data:{
              fechaInicio:data.startDate,
              fechaFinalizacion:data.completionDate,
              estado:data.status,
              condicionesIniciales:data.initialConditions,
              distribucionIngresos:data.incomeDistribution
            },
            include: {
              Agencia: true,
              Grupo:true
            }
        })
     } else {
      contract=await this.db.contrato.update({
         where:{idAg_idAp_idGr_fechaInicio:{
              idAg: Number (agencyId),
            idAp: Number (apprenticeId),
            idGr: Number (groupId),
            fechaInicio: new Date(startDate)
         }
         },
         data:{
              fechaInicio:data.startDate,
              fechaFinalizacion:data.completionDate,
              estado:data.status,
              condicionesIniciales:data.initialConditions,
              distribucionIngresos:data.incomeDistribution

         },
          include:{
            Agencia:true,
            Artista:true
          }
      })
     } 
       return ContractResponseDto.toEntity(contract,!apprenticeId? "Group":"Artist")
    }
    async delete(idC: any): Promise<void> {
      let {agencyId,apprenticeId,groupId,startDate,id}=idC
         
        if(!apprenticeId){
          id=Number(id) 
          await this.db.contratoGrupo.delete({
            where:{id},
            })
     } else {
      await this.db.contrato.delete({
         where:{idAg_idAp_idGr_fechaInicio:{
             idAg: Number (agencyId),
            idAp: Number (apprenticeId),
            idGr: Number (groupId),
            fechaInicio: new Date(startDate)
         }
         } 
      })
     } 
       
    }

    async  findAll(): Promise<Contract[]> {
        const artistContracts = await this.db.contrato.findMany({
            include: {
                Agencia: true,
                Artista: true
            }
        });
        const groupContracts = await this.db.contratoGrupo.findMany({
            include: {
                Agencia: true,
                Grupo: true
            }
        });
        artistContracts.push(...groupContracts)
        return ContractResponseDto.toEntities(artistContracts);
    }

}