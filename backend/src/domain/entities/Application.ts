export default class Application {
    readonly id: number;
    readonly date: Date | string;
    readonly idAgency: number;
    readonly roles: string[];
    readonly idConcept: number;
    readonly groupName: string;
  
    // 🔥 PROTOTIPOS
    readonly apprentices: {
      apprenticeId: number;
      name: string;
      rol:string;
      status: string;
    }[];
  
    readonly artists: {
      idApprentice: number;
      groupId: number;
      realName: string;
      artisticName: string;
      rol:string;
      status: string;
    }[];
  
    readonly status: string;
    readonly idVisualConcept: number;
  
    constructor(attrs: {
      id: number;
      date: Date | string;
      idAgency: number;
      roles: string[];
      idConcept: number;
      groupName: string;
      apprentices: {
        apprenticeId: number;
        name: string;
        rol:string;
      status: string;
      }[];
      artists: {
        idApprentice: number;
        groupId: number;
        realName: string;
        artisticName: string;
        rol:string;
        status: string;
      }[];
      status: string;
      idVisualConcept: number;
    }) {
      this.id = attrs.id;
      this.date = attrs.date;
      this.idAgency = attrs.idAgency;
      this.roles = attrs.roles;
      this.idConcept = attrs.idConcept;
      this.groupName = attrs.groupName;
      this.apprentices = attrs.apprentices;
      this.artists = attrs.artists;
      this.status = attrs.status;
      this.idVisualConcept = attrs.idVisualConcept;
    }
  }