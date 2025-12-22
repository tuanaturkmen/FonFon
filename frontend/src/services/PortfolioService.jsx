import axios from "axios";

// const BASE_URL = "http://172.20.10.13:8080/api";
const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";

export const getPortfolios = async (userId) => {
  const res = await axios.get(`${BASE_URL}/portfolios/user/${userId}`);
  console.log(res.data);
  return res.data;
};

export const createPortfolio = async (portfolioData) => {
  const res = await axios.post(`${BASE_URL}/portfolios`, portfolioData);
  console.log(res);
};

export const deletePortfolio = async (userId, portfolioId) => {
  const res = await axios.delete(
    `${BASE_URL}/portfolios/user/${userId}/${portfolioId}`
  );
  console.log(res);
};

export const getPortfolioHistory = async (
  userId,
  portfolioId,
  startDate,
  endDate
) => {
  const res = await axios.get(
    `${BASE_URL}/portfolios/user/${userId}/${portfolioId}/values`,
    {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    }
  );
  return res.data;
};
