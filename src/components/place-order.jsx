import { useState, useEffect } from "react";
import {shippingMethods} from "../data/shipping-methods";
import { paymentMethods } from "../data/payment-methods";
import { useNavigate } from "react-router-dom";
import webClient from "../api/web-client";
import backendUrl from "../api/backend-info";



export default function PlaceOrder({user}) {
    
    const navi = useNavigate();
    const [selectedShipping, setSelectedShipping] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState([]);
    const [cart, setCart] = useState(null);

    useEffect(()=>{
        const loadData = async () => {
            try {
                /** get cart */
                const response1 = await webClient.get("/api/carts/get-cart");
                setCart(response1.data);
            } catch (error) {
                if(error.response?.status===400){
                    setCart(null);
                }
            }
        };
        loadData();
    },[]);

    if(!cart){
        return(
            <p>Loading...</p>
        )
    }

    const cartSum = cart.cartSumResponseDTO;
    const itemList = cartSum.itemList;
    console.log(cartSum);

    return(

        <div>
            <div className="row g-4">

                {/* left row */}
                <div className="col-md-8">
                    {/* Transport selection card */}
                    <div className="container my-4">

                        <h5 className="fw-bold mb-3">
                            Select Transport
                        </h5>

                        <div className="card shadow-sm border-0 overflow-hidden rounded-0">

                            {shippingMethods.map((shipping, index) => {
                                const isSelected = selectedShipping === shipping.id;

                                return (
                                    <label
                                        key={shipping.id}
                                        className={`
                                            row
                                            align-items-center
                                            g-3
                                            p-3
                                            m-0
                                            ${index !== shippingMethods.length - 1
                                                ? "border-bottom"
                                                : ""
                                            }
                                            ${isSelected
                                                ? "bg-primary-subtle"
                                                : ""
                                            }
                                        `}
                                        style={{ cursor: "pointer" }}
                                    >

                                        {/* Radio */}
                                        <div className="col-auto">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={shipping.id}
                                                checked={isSelected}
                                                onChange={() =>
                                                    setSelectedShipping(shipping)
                                                }
                                                className="form-check-input"
                                            />
                                        </div>

                                        {/* Logo */}
                                        <div className="col-3 col-md-2 col-lg-1">
                                            <img
                                                src={shipping.logo}
                                                alt={shipping.name}
                                                className="img-fluid"
                                                style={{ maxHeight: "30px" }}
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className="col-9 col-md flex-grow-1 fw-bold">
                                            {shipping.name}
                                        </div>

                                        {/* Delivery */}
                                        <div className="col-12 col-md-4 text-secondary small">
                                            <div>
                                                Estimated delivery date
                                            </div>

                                            <div className="fw-semibold text-dark">
                                                {calcDeliveryDate(shipping.deliveryTime)}
                                                {/* {shipping.deliveryTime} */}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-12 col-md-2 text-md-end fw-bold">
                                            ${cartSum.shippingCost}
                                        </div>

                                    </label>
                                );
                            })}

                        </div>

                    </div>
                    
                    {/* Payment selection card */}
                    <div className="container my-4">

                        <h5 className="fw-bold mb-3">
                            Select Payment Method
                        </h5>

                        <div className="card shadow-sm border-0 overflow-hidden rounded-0">

                            {paymentMethods.map((payment, index) => {
                                const isSelected = selectedPayment === payment.id;

                                return (
                                    <label
                                        key={payment.id}
                                        className={`
                                            row
                                            align-items-center
                                            g-3
                                            p-3
                                            m-0
                                            ${index !== paymentMethods.length - 1
                                                ? "border-bottom"
                                                : ""
                                            }
                                            ${isSelected
                                                ? "bg-primary-subtle"
                                                : ""
                                            }
                                        `}
                                        style={{ cursor: "pointer" }}
                                    >

                                        {/* Radio */}
                                        <div className="col-auto">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={payment.id}
                                                checked={isSelected}
                                                onChange={() =>
                                                    setSelectedPayment(payment.name)
                                                }
                                                className="form-check-input"
                                            />
                                        </div>

                                        {/* Logo */}
                                        <div className="col-3 col-md-2 col-lg-1">
                                            <img
                                                src={payment.logo}
                                                alt={payment.name}
                                                className="img-fluid"
                                                style={{ maxHeight: "30px" }}
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className="col-9 col-md flex-grow-1 fw-bold">
                                            {payment.name}
                                        </div>

                                        {/* Price */}
                                        <div className="col-12 col-md-2 text-md-end fw-bold">
                                            Gratis
                                        </div>

                                    </label>
                                );
                            })}

                        </div>

                    </div>
                </div>

                {/* right row */}
                <div className="col-md-4">

                    <h5 className="fw-bold my-4  mb-3">
                        Order
                    </h5>
                    
                    <div className="card shadow-sm rounded-0">

                        {/* Products */}
                        <div className="card-body p-4">

                            <h5 className="fw-semibold mb-3">
                                You have these products in shopping cart:
                            </h5>

                            {
                                itemList.map(item => {
                                    return(
                                        <div className="d-flex align-items-start pb-3 border-bottom mb-1">

                                            {/* Product image */}
                                            <div
                                                className="d-flex align-items-center justify-content-center me-3 mt-2"
                                                style={{ width: "45px", minWidth: "45px" }}
                                            >
                                                <img
                                                    src={backendUrl+'/public/images/'+item.image}
                                                    alt={item.productName}
                                                    className="img-fluid"
                                                />
                                            </div>

                                            {/* Product name */}
                                            <div className="flex-grow-1 small">
                                                <div className="fw-medium">
                                                    {item.quantity} X {item.productName} 
                                                    <br/>
                                                    Size: {item.size}
                                                </div>
                                            </div>

                                            {/* Product price */}
                                            <div className="small text-nowrap ms-3">
                                                ${item.price*item.quantity}
                                            </div>

                                        </div>
                                    )
                                })
                            }
                            


                            {/* Discount and tax */}
                            <div className="d-flex justify-content-between py-3">
                                <span className="small fw-semibold">
                                    Discount:
                                </span>

                                <span className="small">
                                    - ${cartSum.discount}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between pb-3 border-bottom">
                                <span className="small fw-semibold">
                                    Tax:
                                </span>

                                <span className="small">
                                    ${cartSum.tax}
                                </span>
                            </div>


                            {/* Shipping */}
                            <div className="d-flex justify-content-between pt-3">
                                <span className="small">
                                    Shipping: <strong>{selectedShipping.name}</strong>
                                </span>

                                <span className="small">
                                    ${cartSum.shippingCost}
                                </span>
                            </div>


                            {/* Payment */}
                            <div className="d-flex justify-content-between pt-3">
                                <span className="small">
                                    Payment: <strong>{selectedPayment}</strong>
                                </span>

                                <span className="small">
                                    $0
                                </span>
                            </div>

                        </div>


                        {/* Total */}
                        <div className="card-footer bg-light border-top p-4">
                            <div className="d-flex justify-content-between align-items-center">

                                <span className="small fw-semibold">
                                    Total:
                                </span>

                                <div className="fw-bold">
                                    <span className="me-2">
                                        ${cartSum.total}
                                    </span>

                                    <span>
                                        (VAT included)
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4 mb-5">
                <button
                    className="btn btn-outline-secondary rounded-0 py-3 px-4 ms-3"
                    type="button"
                    onClick={()=>{
                        navi("/cart");
                    }}
                >
                    {"<"} BACK
                </button>

                <button
                    className="btn btn-danger rounded-0 py-3 px-4 ms-3"
                    type="button"
                    onClick={()=>{
                        navi("/place-order");
                    }}
                >
                    PROCEED WITH THE ORDER {">"}
                </button>
            </div>
        </div>
        
        
    )
}

function calcDeliveryDate(days) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString("en-EN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

}