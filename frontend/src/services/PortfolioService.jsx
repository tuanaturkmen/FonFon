import axios from "axios";

const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Automatically attach token if it exists
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getPortfolios = async (userId) => {
  const res = await api.get(`/portfolios/user/me`); //${userId}
  return res.data;
};

export const createPortfolio = async (portfolioData) => {
  const res = await api.post(`/portfolios`, portfolioData);
  return res.data;
};

export const updatePortfolio = async (portfolioId, portfolioData) => {
  const res = await api.put(`/portfolios/${portfolioId}`, portfolioData);
  return res.data;
};

export const deletePortfolio = async (userId, portfolioId) => {
  const res = await api.delete(`/portfolios/user/me/${portfolioId}`); // ${userId}
  return res.data;
};

export const getPortfolioHistory = async (
  userId,
  portfolioId,
  startDate,
  endDate
) => {
  const res = await api.get(
    `/portfolios/user/me/${portfolioId}/values`, // ${userId}
    {
      params: { startDate, endDate },
    }
  );
  return res.data;
};
