import { useState, useEffect } from "react";
import webClient from "../api/web-client";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";

export default function PaymentModal({user, order}) {

    // console.log(order);
    const navi = useNavigate();

    return (
        <div
            className="modal fade"
            id="paymentModal"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-0">

                    <div className="modal-header">
                        <h5 className="modal-title">Placeholder Payment Redirection</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-4">
                            <Waiting/>
                        </div>

                        <div className="row mb-0">

                            <div className="col">
                                <button 
                                    type="button"
                                    className="btn btn-danger rounded-0 w-100"
                                    onClick={async ()=>{
                                        const modalElement = document.getElementById("paymentModal");
                                        const modal = Modal.getInstance(modalElement);
                                        modal?.hide();
                                        if(order){
                                            await webClient.post("/api/payment/pay/"+order.orderId);
                                        }
                                        navi("/order");
                                    }}
                                >
                                    Finish Payment
                                </button>
                            </div>

                            <div className="col">
                                <button 
                                    type="button"
                                    className="btn btn-secondary rounded-0 w-100"
                                    onClick={async ()=>{
                                        const modalElement = document.getElementById("paymentModal");
                                        const modal = Modal.getInstance(modalElement);
                                        modal?.hide();
                                        if(order){
                                            await webClient.post("/api/payment/cancel/"+order.orderId)
                                        }
                                        navi("/order");
                                    }}
                                >
                                    Cancel Payment
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function Waiting() {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === "...") return "";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <span>
            Waiting{dots}
        </span>
    );
}