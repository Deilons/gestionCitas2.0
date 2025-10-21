
import type { ICita } from "./ICita.js"; 


export interface IMutableCita extends ICita {
    fecha: Date;
    motivo: string;
    nombrePaciente: string;
};