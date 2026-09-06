import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";

export default function ContinueModal({user}) {
    const navi = useNavigate();
    return(
        <div
                className="modal fade"
                id="continueModal"
                tabIndex="-1"
                aria-labelledby="continueModalLabel"
                aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h5
                            className="modal-title"
                            id="continueModalLabel"
                        >
                            Continue
                        </h5>

                        <button
                            type="button"
                            className="btn-close rounded-0"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body">
                        Look around for more or go to the shopping cart?
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary rounded-0"
                            onClick={()=>{handleRedirect("continueModal","/",navi)}}
                        >
                            Continue shopping
                        </button>

                        <ContinueButton user={user}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContinueButton({user}) {
    const navi = useNavigate();

    return(
        user?(
            <button 
                className="btn btn-primary rounded-0"
                onClick={()=>{handleRedirect("continueModal","/cart",navi)}}
                // data-bs-dismiss="modal"
            >
                To shopping cart
            </button>
        ):(
            <button
                type="button"
                className="btn btn-primary rounded-0"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
            >
                To shopping cart
            </button>
        )
    )
}

const handleRedirect = (myModal,customLink,navi)=>{
    const modalElement = document.getElementById(myModal);
    const modal = Modal.getInstance(modalElement);
    modal&&modal.hide();
    navi(customLink);
}