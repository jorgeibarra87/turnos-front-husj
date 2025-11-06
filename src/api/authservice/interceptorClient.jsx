import axios from "axios";

const baseURL = "http://localhost:8081/"; // Tu URL del backend

// 🔹 Instancia SIN token
export const apiSinToken = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        //"X-Public-Route": "true",
    },
});

// 🔹 Instancia CON token
export const apiConToken = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

// Interceptor para agregar token automáticamente
apiConToken.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default { apiSinToken, apiConToken };