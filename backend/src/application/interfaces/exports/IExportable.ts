import type { ExportOptions } from "./IExportOptions";

export interface IExportable<T> {
    export(data: T[], options?: ExportOptions): Promise<Buffer>;
}



