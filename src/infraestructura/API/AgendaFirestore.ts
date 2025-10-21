// src/infrastructure/persistence/AgendaFirestore.ts

import * as admin from 'firebase-admin';
import type { IAgendaRepository } from '../../dominio/Agenda/IAgendaRepository.js';
import type { ICita } from '../../dominio/Cita/ICita.js';
import { Cita } from '../../dominio/Cita/Cita.js';

function mapToCita(doc: admin.firestore.DocumentSnapshot): ICita {
    const data = doc.data();
    if (!data) throw new Error("Datos de documento invalidos.");
    
    const fechaCita = data.fechaCita.toDate();

    const cita = new Cita(
        fechaCita, 
        data.motivoCita,
        data.nombrePaciente, 
        data.nombreMedico, 
        data.idPaciente, 
        data.idMedico
    );
    (cita as any).id = doc.id; 
    
    return cita;
};

export class AgendaFirestore implements IAgendaRepository {
    private db: admin.firestore.Firestore;
    private collectionName = 'citas';

    constructor(firestore: admin.firestore.Firestore) {
        this.db = firestore;
    };

    // CREATE / UPDATE
    public async guardar(cita: ICita): Promise<void> {
        const docData = {
            nombrePaciente: cita.nombrePaciente,
            fechaCita: cita.fecha, 
            motivoCita: cita.motivo,
            nombreMedico: cita.nombreMedico,
            idPaciente: cita.idPaciente,
            idMedico: cita.idMedico,
        };
        await this.db.collection(this.collectionName).doc(cita.id).set(docData, { merge: true });
    };

    // READ (Por ID)
    public async obtenerPorId(idCita: string): Promise<ICita | null> {
        const doc = await this.db.collection(this.collectionName).doc(idCita).get();
        if (!doc.exists) {
            return null;
        };
        return mapToCita(doc);
    };
    
    // READ (Listar Todos)
    public async listarTodas(): Promise<ICita[]> {
        const snapshot = await this.db.collection(this.collectionName).get();
        return snapshot.docs.map(mapToCita);
    };

    // DELETE
    public async eliminar(idCita: string): Promise<void> {
        await this.db.collection(this.collectionName).doc(idCita).delete();
    };
};