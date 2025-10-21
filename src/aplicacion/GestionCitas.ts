import type { IAgendaRepository } from "../dominio/Agenda/IAgendaRepository.js";
import type { IGestionCitas } from "./IGestionCitas.js";
import type { ICita } from "../dominio/Cita/ICita.js";
import { Cita } from "../dominio/Cita/Cita.js";

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

    async actualizarCita(idCita: string, data: { nombrePaciente: string, fechaCita: string, motivoCita?: string }): Promise<ICita> {
        const citaActualizada = new Cita(
        new Date(data.fechaCita), 
        data.motivoCita || "Sin especificar", 
        data.nombrePaciente, 
        "Dr. Hexagonal (Simulado)", 
        "PAC-001", 
        "MED-001"
        );
        await this.agendaRepo.guardar(citaActualizada);
        return citaActualizada;
    };
    
};
