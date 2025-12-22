import axios from "axios";

<<<<<<< HEAD
//   const BASE_URL = "http://172.20.10.13:8080/api";
const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";
=======
 const BASE_URL = "http://localhost:8080/api";
//const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";
>>>>>>> fef7e17604366e41294b6a72f7f38b94a740024b

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
      startDate: "2025-10-17",
      endDate: "2025-10-19",
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
