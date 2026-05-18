import axios from "axios";

const api = axios.create({
  baseURL: "https://shopeasy-a53s.onrender.com/",
  withCredentials: true,
});

export default api;
