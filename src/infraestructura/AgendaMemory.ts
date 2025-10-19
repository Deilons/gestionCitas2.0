import type { IAgendaRepository } from "../dominio/Agenda/IAgendaRepository.js";
import type { ICita } from "../dominio/Cita/ICita.js";
export class AgendaMemory implements IAgendaRepository {
    private citas: ICita[] = [];

    async listarTodas(): Promise<ICita[]> {
        return Promise.resolve(this.citas);
    };

    async guardar(cita: ICita): Promise<void> {
        const index = this.citas.findIndex(c => c.id === cita.id);

        if (index !== -1) {
            this.citas[index] = cita;
        } else {
            this.citas.push(cita);
        };
    };

    async eliminar(idCita: string): Promise<void> {
        this.citas = this.citas.filter(cita => cita.id !== idCita);
    };

    async obtenerPorId(idCita: string): Promise<ICita | null> {
        return this.citas.find(cita => cita.id === idCita) || null;
    };
};