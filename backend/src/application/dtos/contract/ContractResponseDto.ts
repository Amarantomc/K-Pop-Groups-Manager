import type { Agency } from "../../../domain/entities/Agency";
import Contract from "../../../domain/entities/Contract";
import  { Group } from "../../../domain/entities/Group";
import { ContractType } from "../../../domain/enums/ContractType";
import { ContractFactory } from "../../../domain/factories/ContractFactory";
import { AgencyResponseDTO } from "../agency/AgencyResponseDTO";
import { ArtistResponseDto } from "../artist/ArtistResponseDto";
import { GroupResponseDTO } from "../group/GroupResponseDTO";

export class ContractResponseDto {
  constructor(
    public readonly type: string,
    public readonly agency: AgencyResponseDTO,
    public readonly startDate: string,
    public readonly status: string,
    public readonly initialConditions: string,
    public readonly incomeDistribution: string,
    public readonly artist?:ArtistResponseDto,
    public readonly group?:GroupResponseDTO,
    public readonly completionDate?: string | null,
  
  ) {}

  static fromEntity(contract: Contract): ContractResponseDto {
    const agency=AgencyResponseDTO.fromEntity(contract.agency);
    const baseData = {
      type: contract.type,
      agency:agency,
      startDate: contract.startDate.toString(),
      status: contract.status,
      initialConditions: contract.initialConditions,
      incomeDistribution: contract.incomeDistribution,
      completionDate: contract.completionDate?.toString()||undefined,
      
    };
    

    if (contract.type === ContractType.Artist) {
      const artist=ArtistResponseDto.fromEntity(contract.artist!)
      return new ContractResponseDto(
        baseData.type,
        baseData.agency,
        baseData.startDate,
        baseData.status,
        baseData.initialConditions,
        baseData.incomeDistribution,
        artist,
        undefined,
        baseData.completionDate,
        
      );
    }

    else {
      const group=GroupResponseDTO.fromEntity(contract.group!)
      return new ContractResponseDto(
        baseData.type,
        baseData.agency,
        baseData.startDate,
        baseData.status,
        baseData.initialConditions,
        baseData.incomeDistribution,
        undefined,
        group,
        baseData.completionDate,
        
      );
    }
 
  }

  static toEntity(contract:any,type:string):Contract{
    
    const agency=AgencyResponseDTO.toEntity(contract.Agencia);
    if(type===ContractType.Artist){
        const artist=ArtistResponseDto.toEntity(contract.Artista)
        return ContractFactory.create(agency,type,contract.fechaInicio,contract.condicionesIniciales,contract.distribucionIngresos,contract.estado,artist)
    }else {
        const group =this.GroupInContractToEntity(contract.Grupo,agency)
        return ContractFactory.create(agency,type,contract.fechaInicio,contract.condicionesIniciales,contract.distribucionIngresos,contract.estado,undefined,group,contract.id)
    }
        
    }
  

  static fromEntities(contracts: Contract[]): ContractResponseDto[] {
    return contracts.map(c => this.fromEntity(c));
  }

  static toEntities(contracts: any): Contract[] {
    return contracts.map((c:any) => this.toEntity(c,c.Artista? "Artist": "Group"));
  }

  private static GroupInContractToEntity(group:any,agency:Agency):Group{
     return new Group({
      id:group.id,
      name:group.nombreCompleto,
      debut:group.fechaDebut,
      memberCount:group.Nomiembros,
      status:group.estadoGrupo,
      agency:agency})
  }
}