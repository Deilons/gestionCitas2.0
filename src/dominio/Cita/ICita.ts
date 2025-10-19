export interface ICita {
    readonly id: string;
    fecha: Date;
    readonly motivo: string;
    readonly nombrePaciente: string; 
    readonly nombreMedico: string;
    readonly idPaciente: string;
    readonly idMedico: string;

    obtenerResumen(): string;
}
