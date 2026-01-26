import type { ContractStatus } from "../enums/ContractStatus";
import type { ContractType } from "../enums/ContractType";
import type { Agency } from "./Agency";
import type { Artist } from "./Artist";
import type { Group } from "./Group";

export default class Contract {
  readonly agency: Agency;
  readonly artist?: Artist;
  readonly group?: Group;
  readonly idGroupContract?: number;
  readonly startDate: Date | string;
  readonly completionDate?: Date | string;
  readonly incomeDistribution: string;
  readonly status: ContractStatus | string;
  readonly initialConditions: string;
  readonly type: ContractType;
  //readonly id?: number

  constructor(attrs: {
    agency: Agency;
    artist: Artist;
    group: Group;
    idGroupContract: number;
    type: ContractType;
    startDate: Date | string;
    completionDate: Date | string;
    incomeDistribution: string;
    status: ContractStatus | string;
    initialConditions: string;
    //id: number
  }) {
    this.agency = attrs.agency;
    this.artist = attrs.artist;
    this.group = attrs.group;
    this.idGroupContract = attrs.idGroupContract;
    this.type = attrs.type;
    this.startDate = attrs.startDate;
    this.completionDate = attrs.completionDate;
    this.incomeDistribution = attrs.incomeDistribution;
    this.status = attrs.status;
    this.initialConditions = attrs.initialConditions;
    //this.id = attrs.id
  }
}