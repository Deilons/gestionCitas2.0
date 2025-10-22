import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { createApp } from './app.js';

// Cargar variables de entorno
dotenv.config();

// Obtener la ruta del JSON de credenciales
const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './ServiceAccountKey.json'; 
const PORT = parseInt(process.env.PORT || '3000', 10);

export async function startServer() {
    
    // 1. Inicialización de la Base de Datos (Detalle de Infraestructura)
    let db: admin.firestore.Firestore;
    try {
        const serviceAccount = require(SERVICE_ACCOUNT_PATH); 
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log("✅ Conexión a Firebase Firestore establecida.");

    } catch (error) {
        console.error("Error FATAL al inicializar Firebase. Verifique la ruta y el archivo de credenciales.", error);
        process.exit(1);
    };
    
    // 2. Creación de la Aplicacion desde app.ts
    const app = createApp(db);
    
    // 3. Arranque del Servidor
    try {
        await app.listen({ port: PORT });
        console.log("==================================================");
        console.log(`🚀 API de Citas corriendo en http://localhost:${PORT}`);
        console.log("==================================================");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    };
};