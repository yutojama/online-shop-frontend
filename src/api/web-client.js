import axios from "axios";
import backendUrl from "./backend-info";
import { Modal } from "bootstrap";


const webClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true
});


webClient.interceptors.response.use(
  response => response,
  error => {
    if(error.response?.status === 401){
      const modalElement = document.getElementById("loginModal");
      if(modalElement){
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
)

export default webClient;