import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.aviationstack.com/v1",
  timeout: 10000,
});
