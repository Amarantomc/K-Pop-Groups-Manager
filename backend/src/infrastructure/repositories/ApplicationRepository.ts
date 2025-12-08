import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { Application } from "../../domain";
import { ApplicationResponseDto } from "../../application/dtos/application(solicitud)/ApplicationResponseDto";
import type { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import type { UpdateApplicationDto } from "../../application/dtos/application(solicitud)/UpdateApplicationDto";
import { CreateGroupUseCase } from '../../application/usesCase/group/CreateGroupUseCase';
import type { Group } from "../../domain/entities/Group";
import { GroupResponseDTO } from "../../application/dtos/group/GroupResponseDTO";
import type { CreateGroupDTO } from "../../application/dtos/group/CreateGroupDTO";


@injectable()
export class ApplicationRepository implements IApplicationRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork,
    @inject(Types.CreateGroupUseCase) private createGroupUseCase: CreateGroupUseCase
  ) {}

  private get db() {
    return this.unitOfWork.getTransaction();
  }

  async createGroup(data: CreateGroupDTO,applicationId:number): Promise<Group> {



    // ejecutar el caso de uso real que crea el grupo
    const group = await this.createGroupUseCase.execute(data);

    // actualizar estado de la solicitud
    await this.db.Solicitud.update({
        where: { id: applicationId },
        data: { status: "Terminado" }
    });

    return GroupResponseDTO.toEntity(group);
}


  async create(data: CreateApplicationDto): Promise<Application> {

    const idAgency = Number(data.idAgency);
    const idConcept = Number(data.idConcept);
  
    // Validaciones
    const concept = await this.db.Concepto.findUnique({ where: { id: idConcept } });
    const agency = await this.db.Agencia.findUnique({ where: { id: idAgency } });
  
    if (!agency || !concept) {
      throw new Error("Agency or Concept not found");
    }
  
    // Crear solicitud + conectar aprendices y artistas 
    const application = await this.db.Solicitud.create({
      data: {
        nombreGrupo: data.groupName,
        idAgencia: idAgency,
        idConcepto: idConcept,
        roles: data.roles,
        estado: data.status,
        AprendizMiembro: data.apprentices ? { connect: data.apprentices.map(id => ({ id })) } : undefined,
        ArtistaMiembro: data.artists ? 
           { connect: data.artists.map(([idAp, idGr]) => ({
                idAp_idGr: {
                  idAp,
                  idGr
                }
              }))
            }
          : undefined
      },
      include: {
        AprendizMiembro: true,
        ArtistaMiembro: true
      }
    });
  
    return ApplicationResponseDto.toEntity(application);
  }
    async findById(id: any): Promise<Application | null> {
         id=(Number)(id)
        const application=await this.db.Solicitud.findUnique({
           where:{id}
        })
        //console.log(application);
        return application ? ApplicationResponseDto.toEntity(application) : null
    }

    async update(id: string, data: Partial<UpdateApplicationDto>): Promise<Application> {
        const application = await this.db.Solicitud.update({
          where: { id: Number(id) },
          data: {
            nombreGrupo:data.groupName,
            roles:data.roles,
            estado:data.status,
          },
        });
        return ApplicationResponseDto.toEntity(application);
      }
   async delete(id: string): Promise<void> {
    
      await this.db.Solicitud.delete({
        where: { id: Number(id) },
      });
      
  }

    async findAll(): Promise<Application[]> {
      const applications = await this.db.Solicitud.findMany();

      //console.log(applications);
      return ApplicationResponseDto.toEntities(applications);
  }

}