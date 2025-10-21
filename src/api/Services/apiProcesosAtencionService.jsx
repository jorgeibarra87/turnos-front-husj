import axios from 'axios';

// Configuración de variables de entorno
const API_BASE_URL = window.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(window.env.VITE_API_TIMEOUT || '10000', 10);

// Crear instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la petición:', error);

        // Manejo personalizado de errores
        if (error.response) {
            // El servidor respondió con un código de error
            switch (error.response.status) {
                case 404:
                    throw new Error('Proceso de atención no encontrado');
                case 409:
                    throw new Error('No se puede eliminar el proceso de atención porque tiene dependencias asociadas');
                case 400:
                    throw new Error(error.response.data?.message || 'Datos inválidos');
                case 500:
                    throw new Error('Error interno del servidor');
                default:
                    throw new Error(error.response.data?.message || 'Error en la operación');
            }
        } else if (error.request) {
            // La petición se hizo pero no se recibió respuesta
            throw new Error('No se pudo conectar con el servidor');
        } else {
            // Error en la configuración de la petición
            throw new Error('Error en la configuración de la petición');
        }
    }
);

// Servicio para Procesos de Atención
export const procesosAtencionService = {
    // Obtener todos los procesos de atención
    getAll: async () => {
        try {
            const response = await api.get('/procesosAtencion');
            // Validar que retorne un array
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.procesosAtencion)) {
                return response.data.procesosAtencion;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener procesos de atención:', error);
            throw error;
        }
    },

    // Obtener un proceso de atención por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/procesosAtencion/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener proceso de atención ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo proceso de atención
    create: async (procesoAtencionData) => {
        try {
            const response = await api.post('/procesosAtencion', procesoAtencionData);
            return response.data;
        } catch (error) {
            console.error('Error al crear proceso de atención:', error);
            throw error;
        }
    },

    // Actualizar un proceso de atención existente
    update: async (id, procesoAtencionData) => {
        try {
            const response = await api.put(`/procesosAtencion/${id}`, procesoAtencionData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar proceso de atención ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un proceso de atención
    delete: async (id) => {
        try {
            const response = await api.delete(`/procesosAtencion/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar proceso de atención ${id}:`, error);
            throw error;
        }
    },

    // Buscar procesos de atención por detalle
    searchByDetalle: async (detalle) => {
        try {
            const response = await api.get(`/procesosAtencion/buscar?detalle=${encodeURIComponent(detalle)}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al buscar procesos de atención por detalle "${detalle}":`, error);
            throw error;
        }
    },

    // Obtener procesos de atención activos
    getActivos: async () => {
        try {
            const response = await api.get('/procesosAtencion/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener procesos de atención activos:', error);
            throw error;
        }
    },

    // Obtener procesos de atención por cuadro de turno
    getByCuadro: async (cuadroId) => {
        try {
            const response = await api.get(`/procesosAtencion/cuadro/${cuadroId}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al obtener procesos de atención del cuadro ${cuadroId}:`, error);
            throw error;
        }
    },

    // Obtener procesos de atención por proceso
    getByProceso: async (procesoId) => {
        try {
            const response = await api.get(`/procesosAtencion/proceso/${procesoId}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al obtener procesos de atención del proceso ${procesoId}:`, error);
            throw error;
        }
    },

    // Cambiar estado de un proceso de atención
    cambiarEstado: async (id, estado) => {
        try {
            const response = await api.patch(`/procesosAtencion/${id}/estado`, { estado });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado del proceso de atención ${id}:`, error);
            throw error;
        }
    }
};

// Servicio para Cuadros de Turno
export const cuadrosTurnoService = {
    // Obtener todos los cuadros de turno (para el formulario)
    getAll: async () => {
        try {
            const response = await api.get('/cuadro-turnos');

            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.cuadros)) {
                return response.data.cuadros;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener cuadros de turno:', error);
            // En caso de error, retorna array vacío
            return [];
        }
    },

    // Obtener cuadros de turno activos
    getActivos: async () => {
        try {
            const response = await api.get('/cuadro-turnos/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener cuadros de turno activos:', error);
            return [];
        }
    }
};

// Servicio para Procesos
export const procesosService = {
    // Obtener todos los procesos (para el formulario)
    getAll: async () => {
        try {
            const response = await api.get('/procesos');

            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.procesos)) {
                return response.data.procesos;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener procesos:', error);
            // En caso de error, retorna array vacío
            return [];
        }
    },

    // Obtener procesos activos
    getActivos: async () => {
        try {
            const response = await api.get('/procesos/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener procesos activos:', error);
            return [];
        }
    }
};

// Utilidades para validación
export const procesosAtencionValidation = {
    // Validar datos del proceso de atención antes de enviar
    validateProcesoAtencionData: (data) => {
        const errors = [];

        if (!data.detalle || data.detalle.trim().length === 0) {
            errors.push('El detalle del proceso de atención es requerido');
        }

        if (data.detalle && data.detalle.trim().length < 3) {
            errors.push('El detalle del proceso de atención debe tener al menos 3 caracteres');
        }

        if (data.detalle && data.detalle.trim().length > 500) {
            errors.push('El detalle del proceso de atención no puede exceder 500 caracteres');
        }

        if (data.idCuadro && isNaN(parseInt(data.idCuadro))) {
            errors.push('El ID del cuadro de turno debe ser un número válido');
        }

        if (data.idProceso && isNaN(parseInt(data.idProceso))) {
            errors.push('El ID del proceso debe ser un número válido');
        }

        if (typeof data.estado !== 'boolean') {
            errors.push('El estado debe ser un valor booleano');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Limpiar y formatear datos del proceso de atención
    cleanProcesoAtencionData: (data) => {
        return {
            detalle: data.detalle ? data.detalle.trim() : '',
            idCuadro: data.idCuadro && data.idCuadro !== '' ? parseInt(data.idCuadro) : null,
            idProceso: data.idProceso && data.idProceso !== '' ? parseInt(data.idProceso) : null,
            estado: Boolean(data.estado)
        };
    }
};

// Utilidades para obtener información adicional
export const procesoAtencionUtils = {
    // Obtener nombre del cuadro por ID
    getCuadroNombre: (procesoAtencion, cuadros) => {
        if (procesoAtencion.nombreCuadro) {
            return procesoAtencion.nombreCuadro;
        }

        if (procesoAtencion.idCuadroTurno && cuadros) {
            const cuadro = cuadros.find(c => c.id === procesoAtencion.idCuadroTurno);
            return cuadro ? cuadro.nombre : 'Sin cuadro';
        }

        return 'Sin cuadro';
    },

    // Obtener nombre del proceso por ID
    getProcesoNombre: (procesoAtencion, procesos) => {
        if (procesoAtencion.nombreProceso) {
            return procesoAtencion.nombreProceso;
        }

        if (procesoAtencion.idProceso && procesos) {
            const proceso = procesos.find(p => p.idProceso === procesoAtencion.idProceso);
            return proceso ? proceso.nombre : 'Sin proceso';
        }

        return 'Sin proceso';
    },

    // Obtener información completa del cuadro
    getCuadroInfo: (procesoAtencion, cuadros) => {
        if (procesoAtencion.idCuadroTurno && cuadros) {
            const cuadro = cuadros.find(c => c.id === procesoAtencion.idCuadroTurno);
            if (cuadro) {
                return {
                    id: cuadro.id,
                    nombre: cuadro.nombre
                };
            }
        }

        return {
            id: 'No asignado',
            nombre: 'Sin cuadro'
        };
    },

    // Obtener información completa del proceso
    getProcesoInfo: (procesoAtencion, procesos) => {
        if (procesoAtencion.idProceso && procesos) {
            const proceso = procesos.find(p => p.idProceso === procesoAtencion.idProceso);
            if (proceso) {
                return {
                    id: proceso.idProceso,
                    nombre: proceso.nombre
                };
            }
        }

        return {
            id: 'No asignado',
            nombre: 'Sin proceso'
        };
    }
};

// Exportar servicio principal
export { procesosAtencionService as default };
