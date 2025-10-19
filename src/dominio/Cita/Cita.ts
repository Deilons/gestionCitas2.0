import { v4 as uuidv4 } from 'uuid';
import type { ICita } from "./ICita.js";

export class Cita implements ICita {
    public readonly id: string;
    public fecha: Date;
    public readonly motivo: string;
    public readonly nombrePaciente: string; 
    public readonly nombreMedico: string;
    public readonly idPaciente: string;
    public readonly idMedico: string;
    constructor(fecha: Date, motivo: string, nombrePaciente: string,nombreMedico: string,idPaciente: string, idMedico: string)
    {
        const now = new Date();
        if (fecha < now) {
            throw new Error('La fecha de la cita no puede ser en el pasado'); 
        };
        this.id = uuidv4();
        this.fecha = fecha;
        this.motivo = motivo;
        this.nombrePaciente = nombrePaciente;
        this.nombreMedico = nombreMedico;
        this.idPaciente = idPaciente;
        this.idMedico = idMedico;
    };

    public obtenerResumen(): string {
        const fechaFormat = this.fecha.toLocaleDateString('es-ES');
        return `[Cita ${this.id.substring(0, 4)}] Paciente: ${this.nombrePaciente} - Medico: ${this.nombreMedico}. Fecha: ${fechaFormat}. Motivo: ${this.motivo}`;
    };
};