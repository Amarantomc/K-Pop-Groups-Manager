import type { ColumnDefinition } from "./IColumnDefinition";

export interface ExportOptions {
    title?: string;
     
    filename?: string;
    columns?: ColumnDefinition[];
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'LETTER';
}