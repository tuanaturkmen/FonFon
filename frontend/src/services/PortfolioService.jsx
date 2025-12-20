import axios from "axios";

const BASE_URL = "http://192.168.1.12:8080/api";
// const BASE_URL = "https://fonfon-backend.onrender.com/api";

export const getPortfolios = async (userId) => {
  const res = await axios.get(`${BASE_URL}/portfolios/user/${userId}`);
  console.log(res.data);
  return res.data;
};

export const createPortfolio = async (portfolioData) => {
  const res = await axios.post(`${BASE_URL}/portfolios`, portfolioData);
  console.log(res);
};

export const updatePortfolio = async () => {};
