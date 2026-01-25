import type { CreateApprenticeDto } from "../../application/dtos/apprentice/CreateApprenticeDto";
import { ApprenticeResponseDto } from "../../application/dtos/apprentice/ApprenticeResponseDto";
import type { IApprenticeRepository } from "../../application/interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import ApprenticeEvaluation from "../../domain/entities/ApprenticeEvaluation";
import { getAge } from "../../plugins/get-age.plugin";


@injectable()
export class ApprenticeRepository implements IApprenticeRepository {   
    constructor(
        @inject(Types.PrismaClient) private prisma: any,
        @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
    ) {}
    
    private get db() {
        return this.unitOfWork.getTransaction();
    }

    async getAllEvaluations(apprenticeId: number): Promise<ApprenticeEvaluation[]> {
      const evaluations = await this.db.EvaluacionAprendiz.findMany({
          where: { idAp: apprenticeId },
          include: {
              aprendiz: {
                  select: {
                      id: true,
                      nombreCompleto: true,
                      edad: true,
                  },
              },
              agencia: {
                  select: {
                      id: true,
                      nombre: true,
                      ubicacion: true,
                  },
              },
          },
          orderBy: {
              fechaEvaluacion: 'desc', 
          },
      });
  
      return evaluations.map((e: { idAp: any; idAg: any; fechaEvaluacion: any; evaluacion: any; aprendiz: { id: any; nombreCompleto: any; edad: any; }; agencia: { id: any; nombre: any; ubicacion: any; }; }) => new ApprenticeEvaluation({
          apprenticeId: e.idAp,
          agencyId: e.idAg,
          evaluationDate: e.fechaEvaluacion,
          score: e.evaluacion,
          apprentice: e.aprendiz
              ? {
                  id: e.aprendiz.id,
                  fullName: e.aprendiz.nombreCompleto,
                  age: e.aprendiz.edad,
              }
              : null,
          agency: e.agencia
              ? {
                  id: e.agencia.id,
                  name: e.agencia.nombre,
                  location: e.agencia.ubicacion,
              }
              : null,
      }));
  }

    async attractApprentice(apprenticeId: number, agencyId: number): Promise<void> {
        const now = new Date();
        await this.db.AprendizEnAgencia.updateMany({
            where: {
                idAp: apprenticeId,
                estado: "EN PROCESO DE SELECCION"
            },
            data: {
                estado: "TRANSFERIDO",
            },
        });
        await this.db.AprendizEnAgencia.create({
            data: {
                idAp: apprenticeId,
                idAg: agencyId,
                fechaInicio: now,
                estado: "EN ENTRENAMIENTO",
            },
        });
    }

    async apprenticeScout(): Promise<Apprentice[]> {
      const apprentices = await this.db.Aprendiz.findMany({
        where: {
          Agencia: {
            some: {
              estado: "EN PROCESO DE SELECCION",
            },
          },
        },
      });
    
      return ApprenticeResponseDto.toEntities(apprentices);
    }

    async findByName(name: string): Promise<Apprentice | null> {
        name = String(name);
        const apprentice = await this.db.Aprendiz.findFirst({
            where: { nombreCompleto: name }
        });
        return apprentice ? ApprenticeResponseDto.toEntity(apprentice) : null;
    }

    async addEvaluation(apprenticeId: number,agencyId: number,evaluation: number,date: Date): Promise<void> {
      
        if(evaluation < 0 || evaluation > 10){
            throw new Error("La evaluacion debe ser entre 0 - 10");
        }
        await this.db.evaluacionAprendiz.create({data: {
            idAp: apprenticeId,
            idAg: agencyId,
            evaluacion: evaluation,
            fechaEvaluacion: date,
          },
        });
      
        await this.db.AprendizEnAgencia.updateMany({
          where: {
              idAp: apprenticeId,
              idAg: agencyId,
              estado: "EN ENTRENAMIENTO"
          },
          data: {
            estado: "EN PROCESO DE SELECCION",
            fechaFinalizacion: date
          },
        });
        
        let aux = 0;
        if (evaluation > 5) aux = 1;
        else if (evaluation < 5) aux = -1;
      
        if (aux === 0) return;
      
        await this.db.aprendiz.update({
          where: { id: apprenticeId },
          data: {
            nivelEntrenamiento: {
              increment: aux,
            },
          },
        });
      }

    async create(data: CreateApprenticeDto): Promise<Apprentice> {
        const apprentice = await this.db.Aprendiz.create({
            data: {
                nombreCompleto: data.name,
                fechaNacimiento: new Date(data.dateOfBirth),
                edad: getAge(data.dateOfBirth),
                nivelEntrenamiento: 1,
            }
        });
        await this.db.AprendizEnAgencia.create({
            data: {
                idAp: apprentice.id,
                idAg: data.agencyId,
                fechaInicio: new Date()
            }
        });
        return ApprenticeResponseDto.toEntity(apprentice);
    }

    async findById(id: any): Promise<Apprentice | null> {
      id = Number(id);
    
      const apprentice = await this.db.Aprendiz.findFirst({
        where: {
          id: id,
          Artista: {
            is: null,
          },
        },
      });
    
      if (!apprentice) {
        throw new Error("Es un fucking artista o no existe");
      }
    
      return ApprenticeResponseDto.toEntity(apprentice);
    }

    async update(id: string, data: Partial<CreateApprenticeDto>): Promise<Apprentice> {
        const apprentice = await this.db.Aprendiz.update({
            where: { id: Number(id) },
            data: {
                nombreCompleto: data.name,
            },
        });
        return ApprenticeResponseDto.toEntity(apprentice);
    }

    async delete(id: string): Promise<void> {
        const aprendizId = Number(id);
      
        const perfil = await this.db.perfilAprendiz.findUnique({
          where: { aprendizId },
          select: { userId: true }
        });
      
        await this.db.aprendizSolicitaGrupo.deleteMany({
          where: { idAp: aprendizId },
        });
      
        await this.db.evaluacionAprendiz.deleteMany({
          where: { idAp: aprendizId },
        });
      
        await this.db.aprendizEnAgencia.deleteMany({
          where: { idAp: aprendizId },
        });
      
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
      
        if (perfil) {
          await this.db.user.delete({
            where: { id: perfil.userId }
          });
        }
      
        await this.db.aprendiz.delete({
          where: { id: aprendizId },
        });
      }

    async findAll(): Promise<Apprentice[]> {
      const apprentices = await this.db.Aprendiz.findMany({
        where: {
          Artista: {
            is: null, 
          },
        },
      });
    
      return ApprenticeResponseDto.toEntities(apprentices);
    }

    async listByAgency(id: number): Promise<Apprentice[]> {
        //falta poner includes
        const apprentices = await this.db.Aprendiz.findMany({
            where: {
                Agencia: {
                    some: {
                        idAg: id
                    }
                }
            },
        });
        return ApprenticeResponseDto.toEntities(apprentices);
    }
}