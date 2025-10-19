import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import type { IGestionCitas } from '../aplicacion/IGestionCitas.js';

export class TerminalAdapter {
    private rl: readline.Interface;
    private ejecutando: boolean = true;

    constructor(private readonly gestionCitas: IGestionCitas) {
        this.rl = readline.createInterface({ input, output });
    };
    public async start() {
        console.log("====================================");
        console.log("  Sistema de Agendamiento de Citas  ");
        console.log("====================================");
        
        while (this.ejecutando) {
            this.mostrarMenu();
            const opcion = await this.rl.question("Elige una opcion: ");
            await this.manejarOpcion(opcion.trim());
        };
                this.rl.close();
        console.log("Programa finalizado. ¡Hasta luego!");
    };

    private mostrarMenu() {
        console.log("\n--- Menú Principal ---");
        console.log("1. Registrar nueva cita");
        console.log("2. Listar todas las citas");
        console.log("3. Salir");
        console.log("----------------------");
    };

    private async manejarOpcion(opcion: string) {
        switch (opcion) {
            case '1':
                await this.registrarCitaDesdeConsola();
                break;
            case '2':
                await this.listarCitasDesdeConsola();
                break;
            case '3':
                this.ejecutando = false;
                break;
            default:
                console.log("Opcion no valida. Intentalo de nuevo.");
        };
    };

    private async registrarCitaDesdeConsola() {
        console.log("\n--- Registro de Cita ---");
        
        const nombrePaciente = await this.rl.question("Nombre del paciente: ");
        const fechaInput = await this.rl.question("Fecha y hora de la cita (Ej: YYYY-MM-DD HH:MM:SS): ");
        const motivoCita = await this.rl.question("Motivo de la consulta: ");
        
        const data = {
            nombrePaciente: nombrePaciente,
            fechaCita: fechaInput,
            motivoCita: motivoCita
        };

        try {
            const nuevaCita = await this.gestionCitas.registrarCita(data);
            
            console.log("\n Cita registrada con exito:");
            console.log(nuevaCita.obtenerResumen()); 

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`\n ERROR: ${message}`);
        };
    };

    private async listarCitasDesdeConsola() {
        console.log("\n--- Listado de Citas ---");
        
        const resumenes = await this.gestionCitas.obtenerResumenCitas();
        
        if (resumenes.length === 0) {
            console.log("No hay citas registradas.");
            return;
        };

        resumenes.forEach(resumen => console.log(`- ${resumen}`));
    };
};