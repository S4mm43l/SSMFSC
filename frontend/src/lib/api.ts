import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const getSensorPorts = async () => {
  const response = await api.get("/sensor/ports");
  return response.data;
};

export const getMeteoDataByDate = async (date: string) => {
  const response = await api.get(`/sensor/meteo/by-date?date=${date}&limit=2000`);
  return response.data;
};

export const connectSensor = async (path: string) => {
  const response = await api.post("/sensor/connect", { path });
  return response.data;
};

export const disconnectSensor = async () => {
  const response = await api.post("/sensor/disconnect");
  return response.data;
};

export const runMeteoEtl = async () => {
  const response = await api.post("/sensor/meteo-etl/run");
  return response.data;
};

export const getMeteoData = async (limit = 1000) => {
  const response = await api.get(`/sensor/meteo?limit=${limit}`);
  return response.data;
};

export const getMeteoDataByNode = async (node: string, limit = 100) => {
  const response = await api.get(
    `/sensor/meteo/${encodeURIComponent(node)}?limit=${limit}`
  );
  return response.data;
};

export default api;