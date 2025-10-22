import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import type * as admin from 'firebase-admin';

import { AgendaFirestore } from './infraestructura/API/AgendaFirestore.js';
import { GestionCitas } from './aplicacion/GestionCitas.js';
import { CitasController } from './infraestructura/API/AgendaController.js';

/**
 * Crea y configura la instancia de Fastify inyectando todas las dependencias.
 * @param db La instancia de Firestore (Adaptador Secundario).
 * @returns La instancia de Fastify con todas las rutas registradas.
 */
export function createApp(db: admin.firestore.Firestore): FastifyInstance {
    
    // Adaptador Secundario (Repositorio)
    const agendaRepoImpl = new AgendaFirestore(db);
    
    // Servicio de Aplicación (Core)
    const gestionCitasService = new GestionCitas(agendaRepoImpl);
    
    // Instancia del Servidor Fastify
    const app = fastify({ logger: true });

    // Adaptador Primario (Controller)
    app.register(CitasController(gestionCitasService), { prefix: '/api' });
    
    return app;
};