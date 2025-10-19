import type { ICita } from "../dominio/Cita/ICita.js";
export interface IGestionCitas {
    registrarCita(data: { nombrePaciente: string, fechaCita: string, motivoCita?: string }): Promise<ICita>;
    obtenerResumenCitas(): Promise<string[]>;
};