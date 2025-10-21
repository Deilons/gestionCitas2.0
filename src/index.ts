import * as dotenv from 'dotenv';
import fastify from 'fastify';
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' with { type: 'json' };

dotenv.config();

import { AgendaFirestore } from './infraestructura/API/AgendaFirestore.js';
import { GestionCitas } from './aplicacion/GestionCitas.js';
import { CitasController } from './infraestructura/API/AgendaController.js';

// 1. Inicialización de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

// 2. Inicialización del servidor Fastify
const PORT = parseInt(process.env.PORT || '3000', 10);

const buildAndStartServer = async () => {
    const app = fastify({ logger: true });

    const agendaRepoImpl = new AgendaFirestore(db);
    const gestionCitasService = new GestionCitas(agendaRepoImpl);

    app.register(CitasController(gestionCitasService), { prefix: '/api' });

    try {
        await app.listen({ port: PORT });
        console.log("==================================================");
        console.log(`🚀 API DE CITAS corriendo en http://localhost:${PORT}`);
        console.log("==================================================");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

buildAndStartServer();
