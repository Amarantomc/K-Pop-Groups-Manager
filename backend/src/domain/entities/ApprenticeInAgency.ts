export default class ApprenticeInAgency {
    readonly apprenticeId: number;
    readonly agencyId: number;
    readonly startDate: Date;
    readonly endDate?: Date;
    readonly status: string;

    constructor(attrs: {
        apprenticeId: number;
        agencyId: number;
        startDate: Date;
        endDate?: Date;
        status: string;
    }) {
        this.apprenticeId = attrs.apprenticeId;
        this.agencyId = attrs.agencyId;
        this.startDate = attrs.startDate;
        this.endDate = attrs.endDate;
        this.status = attrs.status;
    }
}
