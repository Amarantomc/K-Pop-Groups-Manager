import type { IncomeType } from "../enums/IncomeType";

export default class Income {
    readonly idIncome: number;
    readonly idActivity: number;
    readonly amount: number;
    readonly description: string;
    readonly date: Date | string;
    readonly eventType?: string;

    //readonly responsible: string;

    constructor(attrs: {
        idIncome: number;
        idActivity: number;
        amount: number;
        description: string;
        date: Date | string;
        eventType: string;
        //responsible: string;
    }) {
        this.idIncome = attrs.idIncome;
        this.idActivity = attrs.idActivity;
        this.amount = attrs.amount;
        this.description = attrs.description;
        this.date = attrs.date;
        this.eventType = attrs.eventType;
        //this.responsible = attrs.responsible;
    }
}