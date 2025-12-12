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
import type { ApplicationCreateGroupDTO } from "../../application/dtos/application(solicitud)/ApplicationCreateGroupDTO";



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

  async createFromApplication(dto: ApplicationCreateGroupDTO, applicationId: number) {
    // 1️⃣ Crear nuevo grupo
    const group = await this.db.Grupo.create({
      data: {
        nombreCompleto: dto.groupName,
        fechaDebut: dto.debut,
        estadoGrupo: "Activo",
        idConcepto: dto.conceptId,
        idConceptoVisual: dto.visualConceptId,
        Nomiembros: dto.memberCount,
        Agencias: { connect: { id: dto.agencyId } }
      }
    });
  
    for (let i = 0; i < dto.apprentices.length; i++) {
      const apprenticeId = dto.apprentices[i];
      const role = dto.roles[i] ?? "Miembro";
  
      const existingArtist = await this.db.Artista.findFirst({
        where: { idAp: apprenticeId }
      });
  
      if (existingArtist) {
        throw new Error(`El aprendiz ${apprenticeId} ya debutó como artista.`);
      }
  
      // ✔ Crear Artista (PK compuesta idAp + idGr)
      await this.db.Artista.create({
        data: {
          idAp: apprenticeId,
          idGr: group.id,
  
          nombreArtistico: `Artista ${apprenticeId}`,
          fechaDebut: dto.debut,
          estadoArtista: "Activo",
  
          //grupo: { connect: { id: group.id } },
          //aprendiz: { connect: { id: apprenticeId } }
        }
      });
  
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp: apprenticeId,
          idGrupoDebut: group.id,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: role
        }
      });
    }
  
    const existingArtists: [number, number][] = dto.artists ?? [];
  
    for (let j = 0; j < existingArtists.length; j++) {
      const tuple = existingArtists[j];
      if (!tuple) continue;
  
      const [idAp, oldGroupId] = tuple;
  
      const role = dto.roles[dto.apprentices.length + j] ?? "Miembro";
  
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp,
          idGrupoDebut: oldGroupId,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: role
        }
      });
    }
  
    return group;
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
         console.log(id);
        const application=await this.db.Solicitud.findUnique({
           where:{id},
           include:{
            AprendizMiembro:true,
            ArtistaMiembro:true
           }
        })

        if(!application){
          throw new Error("Application not found");
        }
        //const apprentices = await this.db.Solicitud.findMany()
        console.log(application);
        return ApplicationResponseDto.toEntity(application)
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
      const applications = await this.db.Solicitud.findMany({
        include:{
         AprendizMiembro:true,
         ArtistaMiembro:true
        }
     });

      //console.log(applications);
      return ApplicationResponseDto.toEntities(applications);
  }

}