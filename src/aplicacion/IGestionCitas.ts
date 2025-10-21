import type { ICita } from "../dominio/Cita/ICita.js";
export interface IGestionCitas {
    registrarCita(data: { nombrePaciente: string, fechaCita: string, motivoCita?: string }): Promise<ICita>;
    obtenerResumenCitas(): Promise<string[]>;
    obtenerDetalleCita(idCita: string): Promise<ICita | null>;
    eliminarCita(idCita: string): Promise<void>;
    actualizarCita(idCita: string, data: { nombrePaciente: string, fechaCita: string, motivoCita?: string }): Promise<ICita>;
};