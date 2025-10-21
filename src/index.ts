import { AgendaMemory } from "./infraestructura/AgendaMemory.js";
import { GestionCitas } from "./aplicacion/GestionCitas.js";
import { TerminalAdapter } from "./infraestructura/TerminalAdapter.js";

const agendaRepoImpl = new AgendaMemory();
const gestionCitasService = new GestionCitas(agendaRepoImpl);
const controller = new TerminalAdapter(gestionCitasService);

controller.start();