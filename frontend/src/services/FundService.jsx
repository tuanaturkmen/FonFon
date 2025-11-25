import axios from "axios";

export const getAllFunds = async () => {
  const res = await axios.get("http://192.168.111.15:8080/api/funds");
  return res.data;
};

export const getFundHistory = async (code) => {
  const res = await axios.get(
    `http://192.168.111.15:8080/api/funds/${code}/history`
  );
  return res.data;
};
