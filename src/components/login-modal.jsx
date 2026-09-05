import { useState } from "react";
import webClient from "../api/web-client";
import { Modal } from "bootstrap";

export default function LoginModal({setUser}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async ()=> {
        try {
            const response = await webClient.post("/api/auth/login",
                {
                    username,
                    password
                }
            );
            console.log(response.data);
            const userResponse = await webClient.get("/api/users/get-me");
            if(userResponse){
                // close bootstrap modal after login
                const modalElement = document.getElementById("loginModal");
                const modal = Modal.getInstance(modalElement);
                modal?.hide();
                setUser(userResponse.data);
            }
            
        } catch(error) {
            console.error("Login failed", error);
        }
    }

    return (
        <div
            className="modal fade"
            id="loginModal"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-0">

                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <input
                            type="email"
                            className="form-control rounded-0 mb-3"
                            placeholder="Username"
                            value={username}
                            onChange={
                                (e)=>setUsername(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            className="form-control rounded-0 mb-3"
                            placeholder="Password"
                            value={password}
                            onChange={
                                (e)=>setPassword(e.target.value)
                            }
                        />

                        <button 
                            type="button"
                            className="btn btn-danger rounded-0 w-100"
                            onClick={handleLogin}
                        >
                            LOGIN
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}