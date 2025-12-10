import { Application } from '../../../domain';
import { ApplicationResponseDto } from '../../dtos/application(solicitud)/ApplicationResponseDto';
import type { IApplicationRepository } from '../../interfaces/repositories/IApplicationRepository';

export class FindByArtistUseCase {
    private applicationRepository: IApplicationRepository;

    constructor(applicationRepository: IApplicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    async execute(apprenticeId:number,groupId:number,applicationId: number): Promise<Application[]> {
        if (!applicationId) {
            throw new Error('Application ID must be provided');
        }

        const applications = await this.applicationRepository.findByArtist(apprenticeId,groupId,applicationId);
        if (!applications) {
            throw new Error('Applications not found');
        }

        return ApplicationResponseDto.toEntities(applications);

    }
}