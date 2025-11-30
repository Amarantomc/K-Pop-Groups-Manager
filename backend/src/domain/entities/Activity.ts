import type { ActivityTypes } from "../enums/ActivityType";
import type { Artist } from "./Artist";
//import type { Group } from "./Group";
import Income from "./Income";

export class Activity {
    readonly id: number;
    readonly responsible: string;
    readonly activityType: ActivityTypes|string;
    readonly date: Date | string;
    readonly place: string;
    readonly artists: Artist[];
    //readonly groups: Group[];
    //readonly income: Income | null;

    constructor(attrs: {
        id: number;
        responsible: string;
        activityType: string;
        date: Date | string;
        place: string;
        artists: Artist[];
        //groups: Group[];
       // income: Income ;
    }) {
        this.id = attrs.id;
        this.responsible = attrs.responsible;
        this.activityType = attrs.activityType;
        this.date = attrs.date;
        this.place = attrs.place;
        this.artists = attrs.artists;
        //this.groups = attrs.groups;
        //this.income = attrs.income;
    }
}