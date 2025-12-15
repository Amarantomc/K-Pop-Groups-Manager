import { injectable } from "inversify";
 
import PDFDocument from 'pdfkit';
import type { Readable } from 'stream';
import type { IExportable } from "../application/interfaces/exports/IExportable";
import type { ExportOptions } from "../application/interfaces/exports/IExportOptions";

@injectable()
export class PdfExporter<T> implements IExportable<T> {
    
    async export(data: T[], options?: ExportOptions): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: options?.pageSize || 'A4',
                    layout: options?.orientation || 'portrait',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const chunks: Buffer[] = [];
                
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Título
                if (options?.title) {
                    doc.fontSize(18).font('Helvetica-Bold').text(options.title, { align: 'center' });
                    doc.moveDown();
                }

                // Fecha de generación
                doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleString()}`, { align: 'right' });
                doc.moveDown();

                // Tabla
                if (data.length > 0 && options?.columns) {
                    this.generateTable(doc, data, options.columns);
                } else {
                    doc.fontSize(12).text('No hay datos para mostrar', { align: 'center' });
                }

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private generateTable(doc: PDFKit.PDFDocument, data: T[], columns: any[]): void {
        const startX = 50;
        let startY = doc.y + 10;
        const rowHeight = 30;
        const headerHeight = 35;
        
        // Calcular ancho de columnas
        const pageWidth = doc.page.width - 100;
        const columnWidth = pageWidth / columns.length;

        // Dibujar encabezados
        doc.fontSize(10).font('Helvetica-Bold');
        columns.forEach((col, i) => {
            const x = startX + (i * columnWidth);
            doc.rect(x, startY, columnWidth, headerHeight).fillAndStroke('#4472C4', '#000');
            doc.fillColor('#FFFFFF').text(col.header, x + 5, startY + 10, {
                width: columnWidth - 10,
                align: 'center'
            });
        });

        startY += headerHeight;

        // Dibujar filas
        doc.font('Helvetica').fontSize(9);
        data.forEach((row, rowIndex) => {
            // Verificar si necesitamos nueva página
            if (startY > doc.page.height - 100) {
                doc.addPage();
                startY = 50;
            }

            const fillColor = rowIndex % 2 === 0 ? '#E7E6E6' : '#FFFFFF';

            columns.forEach((col, colIndex) => {
                const x = startX + (colIndex * columnWidth);
                const value = this.getNestedValue(row, col.dataKey);
                
                doc.rect(x, startY, columnWidth, rowHeight).fillAndStroke(fillColor, '#000');
                doc.fillColor('#000000').text(String(value || ''), x + 5, startY + 10, {
                    width: columnWidth - 10,
                    align: 'left',
                    ellipsis: true
                });
            });

            startY += rowHeight;
        });
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
    }
}