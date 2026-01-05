import axios from "axios";

//  const BASE_URL = "http://192.168.1.6:8080/api";
const BASE_URL = "https://fonfon-1045759541438.europe-west6.run.app/api";

export const sendRegister = async (username, email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, {
    username: username,
    email: email,
    password: password,
  });
  console.log(res);
  return res.data.accessToken;
};

export const sendLogin = async (login, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    login: login,
    password: password,
  });
  console.log(res);
  return res.data.accessToken;
};

export const sendLogout = async () => {
  const res = await axios.post(`${BASE_URL}/auth/logout`);
  console.log(res);
  return res;
};
