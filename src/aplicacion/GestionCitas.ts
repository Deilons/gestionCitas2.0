import type { IAgendaRepository } from "../dominio/Agenda/IAgendaRepository.js";
import type { IGestionCitas } from "./IGestionCitas.js";
import type { ICita } from "../dominio/Cita/ICita.js";
import { Cita } from "../dominio/Cita/Cita.js";
import type { IMutableCita } from "../dominio/Cita/IMutableCita.js";

export class GestionCitas implements IGestionCitas {
    constructor(private readonly agendaRepo: IAgendaRepository) {
    };

    async registrarCita(data: { nombrePaciente: string, fechaCita: string, motivoCita?: string }): Promise<ICita> {
        // simulación de datos
        const idPacienteSimulado = "PAC-" + Math.random().toString(36).substring(7);
        const idMedicoSimulado = "MED-001";
        const nombreMedicoSimulado = "Dr. Hexagonal (Simulado)";

        const cita = new Cita(
            new Date(data.fechaCita),
            data.motivoCita || "Sin especificar",
            data.nombrePaciente,
            nombreMedicoSimulado,
            idPacienteSimulado,
            idMedicoSimulado
        );

        await this.agendaRepo.guardar(cita);
        return cita;
    };

    async obtenerResumenCitas(): Promise<string[]> {
        const citas = await this.agendaRepo.listarTodas();
        return citas.map(cita => cita.obtenerResumen());
    };

    async obtenerDetalleCita(idCita: string): Promise<ICita | null> {
        return this.agendaRepo.obtenerPorId(idCita);
    };

    async eliminarCita(idCita: string): Promise<void> {
        await this.agendaRepo.eliminar(idCita);
    };

    async actualizarCita(idCita: string, data: { nombrePaciente?: string, fechaCita?: string, motivoCita?: string }): Promise<ICita> {
        const citaOriginal = await this.obtenerDetalleCita(idCita);
        const cita = citaOriginal as IMutableCita;
        if (data.fechaCita) {
            const nuevaFecha = new Date(data.fechaCita);
            if (isNaN(nuevaFecha.getTime())) {
                throw new Error("Fecha de la cita invalida.");
            }
            if (nuevaFecha.getTime() < Date.now()) {
                throw new Error("La nueva fecha de la cita no puede ser en el pasado.");
            }
            cita.fecha = nuevaFecha;
        };

        if (data.motivoCita !== undefined) {
            cita.motivo = data.motivoCita;
        };

        if (data.nombrePaciente !== undefined) {
            cita.nombrePaciente = data.nombrePaciente;
        };

        await this.agendaRepo.guardar(cita);
        return cita; 
    };
};
