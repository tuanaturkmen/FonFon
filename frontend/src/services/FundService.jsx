import axios from "axios";

//  const BASE_URL = "http://192.168.1.6:8080/api";
const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";

export const getAllFunds = async () => {
  const res = await axios.get(`${BASE_URL}/funds`);
  return res.data;
};

export const getAllFundsByDate = async (date) => {
  const res = await axios.get(`${BASE_URL}/funds/`, {
    params: {
      date: date,
    },
  });
  return res.data;
};

export const getFundHistory = async (code) => {
  const res = await axios.get(`${BASE_URL}/funds/${code}/history`);
  return res.data;
};

export const getTopFunds = async () => {
  const res = await axios.get(`${BASE_URL}/funds/top-changers`, {
    params: {
      startDate: "2025-10-15",
      endDate: "2025-12-26",
    },
  });
  return res.data;
};

export const searchFunds = async (filters) => {
  console.log(filters);
  const res = await axios.get(`${BASE_URL}/funds/search`, {
    params: filters,
  });
  return res.data;
};
