import webClient from "../api/web-client"
import { Modal } from "bootstrap";

export default function LogoutModal({setUser}) {

    const handleLogout = async ()=>{
        await webClient.post("/api/auth/logout");
        const modalElement = document.getElementById("logoutModal");
        const modal = Modal.getInstance(modalElement);
        modal?.hide();
        setUser(undefined);
    }

    return(
        <div
                className="modal fade"
                id="logoutModal"
                tabIndex="-1"
                aria-labelledby="logoutModalLabel"
                aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h5
                            className="modal-title"
                            id="logoutModalLabel"
                        >
                            Logout
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body">
                        Are you sure you want to log out?
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            No
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            onClick={handleLogout}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
