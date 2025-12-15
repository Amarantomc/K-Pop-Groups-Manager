export default class ApprenticeEvaluation {
    readonly apprenticeId: number;
    readonly agencyId: number;
    readonly evaluationDate: Date | string;
    readonly score: number;
  
    readonly apprentice: { id: number; fullName: string; age: number } | null;
    readonly agency: { id: number; name: string; location: string } | null;
  
    constructor(attrs: {
      apprenticeId: number;
      agencyId: number;
      evaluationDate: Date | string;
      score: number;
      apprentice?: { id: number; fullName: string; age: number } | null;
      agency?: { id: number; name: string; location: string } | null;
    }) {
      this.apprenticeId = attrs.apprenticeId;
      this.agencyId = attrs.agencyId;
      this.evaluationDate = attrs.evaluationDate;
      this.score = attrs.score;
  
      this.apprentice = attrs.apprentice ?? null;
      this.agency = attrs.agency ?? null;
    }
  
  }