import { createApiClient } from "../apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicioTurnos = window.env.VITE_URL_TURNOS;
//const apiClienteTurnos = createApiClient(`${ruta}${rutamicroservicioTurnos}/`);

// Usar el proxy local en lugar de la URL directa
const baseURL = '/api/';

console.log('API Client Base URL:', baseURL);

const apiClienteTurnos = createApiClient(baseURL);

export default apiClienteTurnos;