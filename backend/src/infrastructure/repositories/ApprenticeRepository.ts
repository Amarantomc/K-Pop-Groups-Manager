import type { CreateApprenticeDto } from "../../application/dtos/apprentice/CreateApprenticeDto";
import { ApprenticeResponseDto } from "../../application/dtos/apprentice/ApprenticeResponseDto";
 
import type { IApprenticeRepository } from "../../application/interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Status } from "../../domain/enums/ApprenticeStatus";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { equal } from "assert";
import { Agency } from "../../domain/entities/Agency";
 

@injectable()
export class ApprenticeRepository implements IApprenticeRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  async findByName(name: string): Promise<Apprentice|null> {
        name=(String)(name)
        const apprentice=await this.db.Aprendiz.findFirst({
           where:{nombreCompleto:name}
        })
        return apprentice ? ApprenticeResponseDto.toEntity(apprentice) : null
  }



     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateApprenticeDto): Promise<Apprentice> {
         
         const apprentice= await this.db.Aprendiz.create({
            data:{
                nombreCompleto:data.name,
                fechaNacimiento:new Date(data.dateOfBirth),
                edad:data.age,
                nivelEntrenamiento:data.trainingLv,
                estadoAprendiz:data.status              
            }
        })
        
        //Se registra en Tabla de Relacion
        await this.db.AprendizEnAgencia.create({
          data:{
            idAp:apprentice.id,
            idAg:data.agencyId,
            fechaInicio: new Date()
          }
        })

        
        
        return ApprenticeResponseDto.toEntity(apprentice)
    }
    async findById(id: any): Promise<Apprentice | null> {
         id=(Number)(id)
        const apprentice=await this.db.Aprendiz.findUnique({
           where:{id}
        })
        return apprentice ? ApprenticeResponseDto.toEntity(apprentice) : null
    }

    async update(id: string, data: Partial<CreateApprenticeDto>): Promise<Apprentice> {
        const apprentice = await this.db.Aprendiz.update({
          where: { id: Number(id) },
          data: {
            nombreCompleto:data.name,
            fechaNacimiento:data.dateOfBirth,
            edad:data.age,
            nivelEntrenamiento:data.trainingLv,
            estadoAprendiz:data.status
          },
        });
      
        return ApprenticeResponseDto.toEntity(apprentice);
      }
  //  async delete(id: string): Promise<void> {
    
  //     await this.db.Aprendiz.delete({
  //       where: { id: Number(id) },
  //     });
      
  // }


  async delete(id: string): Promise<void> {
    const aprendizId = Number(id);
  
    // 1. Aprendiz intermedias
    await this.db.aprendizSolicitaGrupo.deleteMany({
      where: { idAp: aprendizId },
    });
  
    await this.db.evaluacionAprendiz.deleteMany({
      where: { idAp: aprendizId },
    });
  
    await this.db.aprendizEnAgencia.deleteMany({
      where: { idAp: aprendizId },
    });
  
    await this.db.perfilAprendiz.deleteMany({
      where: { aprendizId },
    });
  
    // 2. Si fue artista
    const artista = await this.db.artista.findFirst({
      where: { idAp: aprendizId },
    });
  
    if (artista) {
      await this.db.artistaLanzaAlbum.deleteMany({
        where: {
          idAp: artista.idAp,
          idGr: artista.idGr,
        },
      });
  
      await this.db.artistaSolicitaGrupo.deleteMany({
        where: {
          idAp: artista.idAp,
          idGr: artista.idGr,
        },
      });
  
      await this.db.artistaEnGrupo.deleteMany({
        where: {
          idAp: artista.idAp,
        },
      });
  
      await this.db.contrato.deleteMany({
        where: {
          idAp: artista.idAp,
          idGr: artista.idGr,
        },
      });
  
      await this.db.artista.delete({
        where: {
          idAp_idGr: {
            idAp: artista.idAp,
            idGr: artista.idGr,
          },
        },
      });
    }
  
    // 3. Borrar aprendiz
    await this.db.aprendiz.delete({
      where: { id: aprendizId },
    });
  }

    async findAll(): Promise<Apprentice[]> {
      const apprentices = await this.db.Aprendiz.findMany();

      return ApprenticeResponseDto.toEntities(apprentices);
  }

     async listByAgency(id: number): Promise<Apprentice[]> {
       
      //falta poner includes
      const apprentices = await this.db.Aprendiz.findMany({
      where: {
        Agencia: {
              some: {
                  idAg:id
              }
          }
      },
        
  });
  
      return ApprenticeResponseDto.toEntities(apprentices);
  }
}