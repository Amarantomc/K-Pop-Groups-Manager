import {Status} from '../../../domain/enums/ApprenticeStatus';
import { getAge } from '../../../plugins/get-age.plugin';


export class CreateApprenticeDto{
    constructor(
        public readonly name:string,
        public readonly dateOfBirth:Date,
        public readonly agencyId?:number
    ){}

    static create(body: any,agencyId:number): CreateApprenticeDto{
        const age = getAge(body.dateOfBirth);
        if(!body.name || !body.dateOfBirth  || !agencyId)
        {
            throw new Error('Missing required fields');
        }
       
        if(age < 15 || age > 50)
        {
            throw new Error('su edad debe ser mayor de 15 y menor que 50');
        }
  
        return new CreateApprenticeDto(body.name,body.dateOfBirth,agencyId);
    }
}