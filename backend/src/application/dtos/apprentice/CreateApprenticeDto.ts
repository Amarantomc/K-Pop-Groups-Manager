import {Status} from '../../../domain/enums/ApprenticeStatus';


export class CreateApprenticeDto{
    constructor(
        public readonly name:string,
        public readonly dateOfBirth:Date,
        public readonly age: number,
        public readonly trainingLv: number,
        public readonly status: string | Status
    ){}

    static create(body: any): CreateApprenticeDto{
        if(!body.name || !body.dateOfBirth || !body.age || !body.trainingLv || !body.status)
        {
            throw new Error('Missing required fields');
        }
        if (!( body.rol in Status))
        {
            throw new Error('Invalid Status');
        }
        if(body.age < 15)
        {
            throw new Error('Invalid Age')
        }
        if(body.trainingLv < 0)
        {
            throw new Error('invalid Training Level')
        }
        return new CreateApprenticeDto(body.name,body.dateOfBirth,body.age,body.trainingLv,body.status)
    }
}