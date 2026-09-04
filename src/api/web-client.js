import axios from "axios";
import backendUrl from "./backend-info";

const webClient = axios.create({
  baseURL: backendUrl,
});

export default webClient;