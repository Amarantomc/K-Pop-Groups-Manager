import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { ExportArtistsToPdfUseCase } from "../../application/usesCase/exports/ExportArtistsToPdfUseCase";
import type { Request, Response } from "express";
import type { ExportCalendarToPdfUseCase } from "../../application/usesCase/exports/ExportCalendarToPdfUseCase";
import type { ExportArtistsOnDebutPdfUseCase } from "../../application/usesCase/exports/ExportArtistsOnDebutPdfUseCase";
import type { ExportAgenciesPdfUseCase } from "../../application/usesCase/exports/ExportAgenciesPdfUseCase";
import type { ExportApprenticesPdfUseCase } from "../../application/usesCase/exports/ExportApprenticesPdfUseCase";
import type { ExportGroupsPdfUseCase } from "../../application/usesCase/exports/ExportGroupsPdfUseCase";
import type { ExportConceptsPdfUseCase } from "../../application/usesCase/exports/ExportConceptsPdfUseCase";
import type { ExportAwardsPdfUseCase } from "../../application/usesCase/exports/ExportAwardsPdfUseCase";
import type { ExportSongsPdfUseCase } from "../../application/usesCase/exports/ExportSongsPdfUseCase";

 

@injectable()
export class ExportController {
    constructor(
        @inject(Types.ExportArtistsToPdfUseCase) private exportArtistsToPdf: ExportArtistsToPdfUseCase,
        @inject(Types.ExportCalendarToPdfUseCase) private exportCalendarToPdf: ExportCalendarToPdfUseCase,
        @inject(Types.ExportArtistsOnDebutPdfUseCase)private exportArtistsOnDebut:ExportArtistsOnDebutPdfUseCase,
        @inject(Types.ExportAgenciesPdfUseCase)private exportAgencies:ExportAgenciesPdfUseCase,
        @inject(Types.ExportApprenticesPdfUseCase)private exportApprentices:ExportApprenticesPdfUseCase,
        @inject(Types.ExportGroupsPdfUseCase)private exportGroups:ExportGroupsPdfUseCase,
        @inject(Types.ExportConceptsPdfUseCase) private exportConcepts:ExportConceptsPdfUseCase,
        @inject(Types.ExportAwardsPdfUseCase)private exportAwards:ExportAwardsPdfUseCase,
        @inject(Types.ExportSongsPdfUseCase)private exportSongs:ExportSongsPdfUseCase
    ) {}

    async exportArtistsPdf(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const pdfBuffer = await this.exportArtistsToPdf.execute(
                id ? Number(id) : undefined
            );

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportCalendarPdf(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const pdfBuffer = await this.exportCalendarToPdf.execute(id!);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportArtistsOnDebutPdf(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const pdfBuffer = await this.exportArtistsOnDebut.execute(Number(id));

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportAgenciesPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportAgencies.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportApprenticesPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportApprentices.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

     async exportGroupsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportGroups.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportConceptsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportConcepts.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportAwardsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportAwards.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }
    
    async exportSongsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportSongs.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }
}