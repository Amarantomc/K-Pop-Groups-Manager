import { ContractType } from "../../../domain/enums/ContractType";

export class CreateContractDto {
  constructor(
    public readonly type: string,
    public readonly agencyId: number,
    public readonly startDate: string,
    public readonly status: string,
    public readonly initialConditions: string,
    public readonly incomeDistribution: string,
    // Contrato Artista y Grupo solo groupId
    public readonly apprenticeId?: number,
    public readonly groupId?: number,
   
    public readonly completionDate?: string
  ) {}

  static Create(body: any): CreateContractDto {
    if (!body.type || !body.agencyId || !body.startDate) {
      throw new Error('Missing required fields');
    }

   if(!(body.type in ContractType)){
    throw new Error("Invalid contract type");
   }

    return new CreateContractDto(
      body.type,
      Number(body.agencyId),
      body.startDate,
      body.status || 'ACTIVO',
      body.initialConditions,
      body.incomeDistribution,
      body.apprenticeId ? Number(body.apprenticeId) : undefined,
      body.groupId ? Number(body.groupId) : undefined,
     body.completionDate
    );
  }
}
