import type { ActivityTypes } from "../enums/ActivityType";
import type { Artist } from "./Artist";
import type { Group } from "./Group";
//import type { Group } from "./Group";
import Income from "./Income";

export class Activity {
    readonly id: number;
    readonly responsible: string;
    readonly activityType: ActivityTypes|string;
    readonly date: Date ;
    readonly place: string;
    readonly eventType:string;
    readonly status: string;
    readonly artists?: Array<{
        apprenticeId: number;
        groupId: number;
        artistName: string;
      }>;
    readonly incomes?: {
        idIncome: number;
        amount: number;
        type: string;
        date: Date;
      }[];
    readonly groups?: {id:number; name: string}[]

    constructor(attrs: {
        id: number;
        responsible: string;
        activityType: string;
        date: Date ;
        place: string;
        eventType:string;
        status: string;
        artists: Array<{
            apprenticeId: number;
            groupId: number;
            artistName: string;
          }>;
        incomes: {
            idIncome: number;
            amount: number;
            type: string;
            date: Date;}[] ;
        groups: {id:number; name: string}[]
    }) {
        this.id = attrs.id;
        this.responsible = attrs.responsible;
        this.activityType = attrs.activityType;
        this.date = attrs.date;
        this.place = attrs.place;
        this.artists = attrs.artists;
        this.eventType=attrs.eventType;
        this.status = attrs.status
        this.incomes = attrs.incomes;
        this.groups = attrs.groups;
    }
}
