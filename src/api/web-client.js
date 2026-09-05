import axios from "axios";
import backendUrl from "./backend-info";

const webClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true
});

export default webClient;