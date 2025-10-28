
import axios from "axios";


export const getFundHistory = async (code) => {
  const res = await axios.get("http://172.20.10.13:8080/api/funds");
  console.log(res)
  return res.data;
};

