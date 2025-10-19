import type { ICita } from "../Cita/ICita.js";

export interface IAgendaRepository {
    // listar
    listarTodas(): Promise<ICita[]>;
    // crear y modificar
    guardar(cita: ICita): Promise<void>;
    // eliminar por id
    eliminar(idCita: string): Promise<void>;
    //Cita por id
    obtenerPorId(idCita: string): Promise<ICita | null>;
};