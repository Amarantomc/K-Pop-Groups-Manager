import { inject, injectable } from "inversify";
import type { CreateContractDto } from "../../application/dtos/contract/CreateContractDto";
import type { IContractRepository } from "../../application/interfaces/repositories/IContractRepository";
import type { Contract } from "../../domain";
import { Types } from "../di/Types";
import type { IUnitOfWork } from "../../application/interfaces/IUnitOfWork";
import { ContractResponseDto } from "../../application/dtos/contract/ContractResponseDto";
import type { Artist } from "../../domain/entities/Artist";
import { ArtistResponseDto } from "../../application/dtos/artist/ArtistResponseDto";
import type { Group } from "../../domain/entities/Group";
import { GroupResponseDTO } from "../../application/dtos/group/GroupResponseDTO";
import { error, group } from "console";

@injectable()
export class ContractRepository implements IContractRepository{
    
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}


    private get db() {
    return this.unitOfWork.getTransaction();
    }

    async groupsOfferContract(): Promise<Group[]> {
    const groups = await this.db.grupo.findMany({
      where: {
        estadoGrupo: "EN PAUSA",
      },
    });
  
    return GroupResponseDTO.toEntities(groups);
    } 

    
    async offerContract(): Promise<Artist[]> {
    const artists = await this.db.artista.findMany({
      where: {
        estadoArtista: "EN PAUSA",
      },
    });
  
    return ArtistResponseDto.toEntities(artists);
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

    async updateStatus(agencyId: number,groupId: number,apprenticeId: number | null,status: string): Promise<Contract> {
    
      // CASO 1: CONTRATO ARTISTA
      if (apprenticeId !== null) {
        const contrato = await this.db.contrato.findFirst({
          where: {
            idAg: agencyId,
            idGr: groupId,
            idAp: apprenticeId,
            estado: "PENDIENTE"
          },
          orderBy: {
            fechaInicio: "desc",
          },
          include: {
            Agencia: true,
            Artista: {
              include: {
                aprendiz: true,
                grupo: true,
              },
            },
          },
        });
    
        if (!contrato) {
          throw new Error("Active artist contract not found");
        }
    
        const updated = await this.db.contrato.update({
          where: {
            idAg_idAp_idGr_fechaInicio: {
              idAg: contrato.idAg,
              idAp: contrato.idAp,
              idGr: contrato.idGr,
              fechaInicio: contrato.fechaInicio,
            },
          },
          data: {
            estado: status,
          },
          include: {
            Agencia: true,
            Artista: {
              include: {
                aprendiz: true,
                grupo: true,
              },
            },
          },
        });
    
        return ContractResponseDto.toEntity(updated, "Artist");
      }
    
      // CASO 2: CONTRATO DE GRUPO
      const contratoGrupo = await this.db.contratoGrupo.findFirst({
        where: {
          idAg: agencyId,
          IdGr: groupId,
          estado: "PENDIENTE"
        },
        orderBy: {
          fechaInicio: "desc",
        },
        include: {
          Agencia: true,
          Grupo: true,
        },
      });
    
      if (!contratoGrupo) {
        throw new Error("Active group contract not found");
      }
    
      const updatedGroup = await this.db.contratoGrupo.update({
        where: {
          id: contratoGrupo.id,
        },
        data: {
          estado: status,
        },
        include: {
          Agencia: true,
          Grupo: true,
        },
      });
    
      return ContractResponseDto.toEntity(updatedGroup, "Group");
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

    async findAll(): Promise<Contract[]> {
      // Contratos de artista
      const artistContracts = await this.db.contrato.findMany({
        include: {
          Agencia: true,
          Artista: {
            include: { aprendiz: true }
          }
        }
      });
    
      // Contratos de grupo
      const groupContracts = await this.db.contratoGrupo.findMany({
        include: {
          Agencia: true,
          Grupo: {
            include: {
              Agencias: true,
              concepto: true,
              conceptoVisual: true,
              HistorialArtistas: {
                where: { fechaFinalizacion: null },
                include: { artista: { include: { aprendiz: true } } }
              },
              Lanzamiento: { include: { album: true } },
              Actividades: {
                include: {
                  actividad: {
                    include: {
                      Personas: { include: { artista: true } },
                      Ingreso: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      
      const groupContractsArray = groupContracts.map((gc: { Grupo: any; }) => ({
        ...gc,
        grupo: gc.Grupo // aquí convertimos el objeto en array
      }));

      // Unimos todo en un solo array
      const contracts = [...artistContracts, ...groupContractsArray];

      // Llamamos al toEntities que siempre recibe un array
      return ContractResponseDto.toEntities(contracts);
    
    }

    async findByArtist(apprenticeId: number, groupId: number): Promise<Contract[]> {
      const  contracts=await this.db.contrato.findMany({
         where:{idAp: Number (apprenticeId),
            idGr: Number (groupId),
          
         },
          include:{
            Agencia:true,
            Artista:true
          }
  })  
      return ContractResponseDto.toEntities(contracts);

    }

}