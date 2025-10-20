// src/services/adnIngresoService.js

import apiClienteDinamica from "./apiClienteDinamica";

/**
 * Llama al endpoint POST para obtener información de ingresos y pacientes
 * para una lista de números de documento.
 * @param {string[]} documentos Lista de números de documento (PACNUMDOC).
 * @returns {Promise<GenPacienListIngresosResDTO[]>} Lista de resultados.
 */
export const obtenerIngresosPorDocumentos = async (documentos) => {
    try {
        // Usamos POST para enviar la lista de documentos en el cuerpo
        const response = await apiClienteDinamica.post('genPacien/adnIngreso/todos/lista', documentos);
        return response.data;
    } catch (error) {
        console.error('Error al obtener ingresos por lote de documentos:', error);
        throw error;
    }
};