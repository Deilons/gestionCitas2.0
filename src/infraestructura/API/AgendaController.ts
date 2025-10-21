import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { IGestionCitas } from '../../aplicacion/IGestionCitas.js';

// --- ESQUEMAS DE VALIDACIÓN ---

const idParamSchema = {
    type: 'object',
    properties: { id: { type: 'string', minLength: 1 } },
    required: ['id']
};

const citaBodySchema = {
    type: 'object',
    required: ['nombrePaciente', 'fechaCita'],
    properties: {
        nombrePaciente: { type: 'string', minLength: 3 },
        fechaCita: { type: 'string', format: 'date-time' },
        motivoCita: { type: 'string' }
    },
    additionalProperties: false
};

const citaResponseSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        nombrePaciente: { type: 'string' },
        fechaCita: { type: 'string' },
        motivoCita: { type: 'string' },
        nombreMedico: { type: 'string' }
    }
};

const errorResponseSchema = {
    type: 'object',
    properties: { error: { type: 'string' } }
};

// ----------------------------------------------------
// CONTROLADOR (Plugin de Fastify)
// ----------------------------------------------------

export function CitasController(gestionCitas: IGestionCitas) {

    return async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {

        // POST /citas: Registrar una nueva cita (CREATE)
        fastify.post('/citas', {
            schema: {
                body: citaBodySchema,
                response: {
                    201: citaResponseSchema,
                    400: errorResponseSchema
                }
            }
        }, async (request, reply) => {
            const data = request.body as any;

            try {
                const nuevaCita = await gestionCitas.registrarCita(data);
                reply.code(201);
                return {
                    id: nuevaCita.id,
                    nombrePaciente: nuevaCita.nombrePaciente,
                    fechaCita: nuevaCita.fecha.toISOString(),
                    motivoCita: nuevaCita.motivo,
                    nombreMedico: nuevaCita.nombreMedico
                };

            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : "Error de validacion desconocido en el dominio";
                reply.code(400);
                return { error: errorMessage };
            }
        });

        // GET /citas: Listar todas las citas (READ - Resumen)
        fastify.get('/citas', async (request, reply) => {
            const resumenes = await gestionCitas.obtenerResumenCitas();
            return { citas: resumenes };
        });

        // GET /citas/:id: Obtener una cita por ID (READ - Detalle)
        fastify.get('/citas/:id', {
            schema: {
                params: idParamSchema,
                response: {
                    200: citaResponseSchema,
                    404: errorResponseSchema
                }
            }
        }, async (request, reply) => {
            const params = request.params as { id: string };
            try {
                const cita = await gestionCitas.obtenerDetalleCita(params.id);

                return {
                    id: cita?.id,
                    nombrePaciente: cita?.nombrePaciente,
                    fechaCita: cita?.fecha.toISOString(),
                    motivoCita: cita?.motivo,
                    nombreMedico: cita?.nombreMedico
                };
            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : "Cita no encontrada";
                reply.code(404);
                return { error: errorMessage };
            }
        });

        // PUT /citas/:id: Actualizar una cita (UPDATE)
        fastify.put('/citas/:id', {
            schema: {
                params: idParamSchema,
                body: { ...citaBodySchema, required: [] as string[] },
                response: {
                    200: citaResponseSchema,
                    400: errorResponseSchema,
                    404: errorResponseSchema
                }
            }
        }, async (request, reply) => {
            const params = request.params as { id: string };
            const data = request.body as any;
            try {
                const citaActualizada = await gestionCitas.actualizarCita(params.id, data);
                return {
                    id: citaActualizada.id,
                    nombrePaciente: citaActualizada.nombrePaciente,
                    fechaCita: citaActualizada.fecha.toISOString(),
                    motivoCita: citaActualizada.motivo,
                    nombreMedico: citaActualizada.nombreMedico
                };
            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : "Error de actualizacion desconocido";

                let code: 200 | 400 | 404 = 400;
                if (errorMessage.includes('no encontrada')) {
                    code = 404;
                };
                reply.code(code).send({ error: errorMessage });
                return;
            };

            // DELETE /citas/:id: Eliminar una cita (DELETE)
            fastify.delete('/citas/:id', {
                schema: {
                    params: idParamSchema,
                    response: {
                        204: { type: 'null' },
                        404: errorResponseSchema
                    }
                }
            }, async (request, reply) => {
                const params = request.params as { id: string };
                try {
                    await gestionCitas.eliminarCita(params.id);
                    reply.code(204).send();
                } catch (error) {
                    const errorMessage = (error instanceof Error) ? error.message : "Error de eliminacion desconocido";
                    reply.code(404).send({ error: errorMessage });
                }
            });
        });
    };
};