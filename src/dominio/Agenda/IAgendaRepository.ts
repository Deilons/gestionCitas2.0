import type { ICita } from "../Cita/ICita.js";

export interface IAgendaRepository {
    // listar
    obtenerCitas(): Promise<ICita[]>;
    // crear y modificar
    guardarCita(cita: ICita): Promise<void>;
    // eliminar por id
    eliminarCita(idCita: string): Promise<void>;
    //Cita por id
    obtenerCita(idCita: string): Promise<ICita | null>;
};