import axios from "axios";

const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getUSDHistory = async (amount, startDate, endDate) => {
  const res = await api.get(`/rates/usd/benchmark`, {
    params: { amount, startDate, endDate },
  });
  return res.data;
};

export const getEUROHistory = async (amount, startDate, endDate) => {
  const res = await api.get(`/rates/eur/benchmark`, {
    params: { amount, startDate, endDate },
  });
  return res.data;
};
