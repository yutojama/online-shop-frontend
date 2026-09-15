import axios from "axios";
import backendUrl from "./backend-info";

const webClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true
});

webClient.interceptors.response.use(
  response => response,
  error => {
    if(error.response?.status === 401){
      window.location.href = ""
    }
  }
)

export default webClient;