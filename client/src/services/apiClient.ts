import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-auth-token": localStorage.getItem("auth-token"),
  },
});

export default apiClient;
