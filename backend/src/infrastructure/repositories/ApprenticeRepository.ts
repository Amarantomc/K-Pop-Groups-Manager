import type { CreateApprenticeDto } from "../../application/dtos/apprentice/CreateApprenticeDto";
import { ApprenticeResponseDto } from "../../application/dtos/apprentice/ApprenticeResponseDto";
import type { IApprenticeRepository } from "../../application/interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import ApprenticeEvaluation from "../../domain/entities/ApprenticeEvaluation";

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
                fechaFinalizacion: null,
            },
            data: {
                fechaFinalizacion: now,
                estado: "Transferido",
            },
        });
        await this.db.AprendizEnAgencia.create({
            data: {
                idAp: apprenticeId,
                idAg: agencyId,
                fechaInicio: now,
                estado: "En entrenamiento",
            },
        });
    }

    async apprenticeScout(): Promise<Apprentice[]> {
        const apprentices = await this.db.Aprendiz.findMany({
            where: {
                Agencia: {
                    some: {
                        estado: "En proceso de seleccion"
                    }
                }
            }
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

    async addEvaluation(apprenticeId: number, agencyId: number, evaluation: number, date: Date): Promise<void> {
        await this.db.evaluacionAprendiz.create({
            data: {
                idAp: apprenticeId,
                idAg: agencyId,
                evaluacion: evaluation,
                fechaEvaluacion: date
            }
        });
    }

    async create(data: CreateApprenticeDto): Promise<Apprentice> {
        const apprentice = await this.db.Aprendiz.create({
            data: {
                nombreCompleto: data.name,
                fechaNacimiento: new Date(data.dateOfBirth),
                edad: data.age,
                nivelEntrenamiento: data.trainingLv,
            }
        });
        //Se registra en Tabla de Relacion
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
        const apprentice = await this.db.Aprendiz.findUnique({
            where: { id }
        });
        return apprentice ? ApprenticeResponseDto.toEntity(apprentice) : null;
    }

    async update(id: string, data: Partial<CreateApprenticeDto>): Promise<Apprentice> {
        const apprentice = await this.db.Aprendiz.update({
            where: { id: Number(id) },
            data: {
                nombreCompleto: data.name,
                fechaNacimiento: data.dateOfBirth,
                edad: data.age,
                nivelEntrenamiento: data.trainingLv,
            },
        });
        return ApprenticeResponseDto.toEntity(apprentice);
    }

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
                        idAg: id
                    }
                }
            },
        });
        return ApprenticeResponseDto.toEntities(apprentices);
    }
}