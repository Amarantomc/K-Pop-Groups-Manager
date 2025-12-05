import type { ContractStatus } from '../../../../frontend/src/config/formSource';
import type { Agency } from '../entities/Agency';
import type { Artist } from '../entities/Artist';
import  Contract from '../entities/Contract';
import type { Group } from '../entities/Group';
import { ContractType } from '../enums/ContractType';

export class ContractFactory {
  static create(
    agency: Agency,
   type: string,
    startDate: Date,
    initialCondition: string,
    incomeDistribution: string,
    status: string,
    artist?: Artist,
    group ?: Group,
    idGroupContract?: number,
  ): Contract {
    
    const contractType = type as ContractType;
    switch(contractType){
        case ContractType.Artist:
            return new Contract({agency:agency,
                artist:artist,
                type:ContractType.Artist,
                startDate:startDate,
                initialCondition:initialCondition,
                incomeDistribution:incomeDistribution,
                status:status as ContractStatus,
                completationDate:undefined,

            })
        case ContractType.Group:
            return new Contract({agency:agency,
                group:group,
                idGroupContract:idGroupContract,
                type:ContractType.Group,
                startDate:startDate,
                initialCondition:initialCondition,
                incomeDistribution:incomeDistribution,
                status:status as ContractStatus,
                completationDate:undefined,
            })
    }
     
  }
}