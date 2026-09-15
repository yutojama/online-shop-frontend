import "../styles/place-order.css"
import { useState, useEffect } from "react";
import {shippingMethods} from "../data/shipping-methods";
import { paymentMethods } from "../data/payment-methods";
import { useNavigate } from "react-router-dom";
import webClient from "../api/web-client";
import backendUrl from "../api/backend-info";



export default function PlaceOrder({user, setOrder}) {
    
    const navi = useNavigate();
    const [selectedShipping, setSelectedShipping] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState([]);
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const [selectedShipAdd, setSelectedShipAdd] = useState(null);
    const [checked, setChecked] = useState(false);
    const [selectedBillAdd, setSelectedBillAdd] = useState(null);

    const [shippingValid, setShippingValid] = useState(true);
    const [paymentValid, setPaymentValid] = useState(true);
    const [shipAddValid, setShipAddValid] = useState(true);
    const [billAddValid, setBillAddValid] = useState(true);


    useEffect(()=>{
        const loadData = async () => {
            try {
                /** get cart */
                const response1 = await webClient.get("/api/carts/get-cart");
                setCart(response1.data);
                const response2 = await webClient.get("/api/addresses/get-my-address")
                setAddresses(response2.data);
                
            } catch (error) {
                if(error.response?.status===400){
                    setCart(null);
                }
            }
        };
        loadData();
    },[]);

    if(!cart||!addresses){
        return(
            <p>Loading...</p>
        )
    }

    const cartSum = cart.cartSumResponseDTO;
    const itemList = cartSum.itemList;
    // console.log(itemList);

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
                        {!shippingValid&&
                            <p className="text-danger ms-2">
                                Invalid Shipping Method
                            </p>
                        }

                        <div className="card shadow-sm border-0 overflow-hidden rounded-0">

                            {shippingMethods.map((shipping, index) => {
                                const isSelected = selectedShipping === shipping.name;

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
                                                onChange={() => {
                                                    setSelectedShipping(shipping.name);
                                                    setShippingValid(true);
                                                }}
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
                        {!paymentValid&&
                            <p className="text-danger ms-2">
                                Invalid Payment Method
                            </p>
                        }

                        <div className="card shadow-sm border-0 overflow-hidden rounded-0">

                            {paymentMethods.map((payment, index) => {
                                const isSelected = selectedPayment === payment.dto;

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
                                                onChange={() => {
                                                    setSelectedPayment(payment.dto);
                                                    setPaymentValid(true);
                                                }}
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

                {/* right(order) row */}
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
                                itemList.map((item,index) => {
                                    return(
                                        <div key={index} className="d-flex align-items-start pb-3 border-bottom mb-1">

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
                                    Shipping: <strong>{selectedShipping}</strong>
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


            {/* Select shipping address */}
            <div>
                <h5 className="fw-bold mb-3 ms-2">
                    Select Shipping Address
                </h5>
                {!shipAddValid&&
                    <p className="text-danger ms-2">
                        Invalid Shipping Address
                    </p>
                }
                {/* checkbox for different billing address */}
                <div className="form-check ms-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="myCheckbox"
                        onChange={(e)=>setChecked(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="myCheckbox">
                        Different Billing address?
                    </label>
                </div>
                {/* shipping address scrolling */}
                
            </div>
            <SelectAddressScroll addresses={addresses} selectedAdd={selectedShipAdd} setSelectedAdd={setSelectedShipAdd} setValid={setShipAddValid}/>
            {checked&&
                <div>
                    <h5 className="fw-bold mb-3 ms-2">
                        Select Billing Address
                    </h5>
                    {!billAddValid&&
                        <p className="text-danger ms-2">
                            Invalid Billing Address
                        </p>
                    }
                    <SelectAddressScroll addresses={addresses} selectedAdd={selectedBillAdd} setSelectedAdd={setSelectedBillAdd} setValid={setBillAddValid}/>
                </div>
            }


            {/* back and continue buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
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
                    data-bs-toggle={
                        selectedShipping.length&&selectedPayment.length&&selectedShipAdd&&(checked?selectedBillAdd:true)?
                        "modal" : undefined
                    }
                    data-bs-target={
                        selectedShipping.length&&selectedPayment.length&&selectedShipAdd&&(checked?selectedBillAdd:true)?
                        "#paymentModal" : undefined
                    }
                    onClick={async ()=>{
                        
                        const shipAdd = addresses.find(add=>add.id===selectedShipAdd);
                        let billAdd = null;
                        if(checked){
                            billAdd = addresses.find(add=>add.id===selectedBillAdd);
                        } else {
                            billAdd = shipAdd;
                        }

                        console.log("click for order")

                        let ifValid = true;
                        if(!selectedShipping.length){
                            setShippingValid(false);
                            console.log("shipping invalid");
                            ifValid = false;
                        }
                        if(!selectedPayment.length){
                            setPaymentValid(false);
                            console.log("payment invalid");
                            ifValid = false;
                        }
                        if(!selectedShipAdd){
                            setShipAddValid(false);
                            console.log("shipping address invalid");
                            ifValid = false;
                        }
                        if(checked&&!selectedBillAdd){
                            setBillAddValid(false);
                            console.log("billing address invalid");
                            ifValid = false;
                        }
                        
                        if(ifValid){
                            const order = await webClient.post("/api/orders/create",
                                {
                                    paymentMethod: selectedPayment,
                                    carrier: selectedShipping,
                                    shippingAddress: shipAdd,
                                    billingAddress: billAdd
                                }
                            );
                            setOrder(order.data);
                        }
                        
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

function SelectAddressScroll({addresses,selectedAdd,setSelectedAdd,setValid}) {
    return(
        <div className="ship-address-carousel mb-4">
            {addresses.map((address) => (
                <div
                    key={address.id}
                    className={`ship-address-card rounded-0 ${
                        selectedAdd === address.id ? "border-primary bg-light" : ""
                    }`}
                    onClick={() => {
                        setSelectedAdd(address.id);
                        setValid(true);
                    }}
                >
                    <div className="ship-address-row">
                        <strong>Firstname: </strong>
                        <span> {address.firstName}</span>
                    </div>
                    <div className="ship-address-row">
                        <strong>Lastname: </strong>
                        <span> {address.lastName}</span>
                    </div>
                    <div className="ship-address-row">
                        <strong>Street: </strong>
                        <span> {address.street}</span>
                    </div>
                    <div className="ship-address-row">
                        <strong>City: </strong>
                        <span> {address.city}</span>
                    </div>
                    <div className="ship-address-row">
                        <strong>Postal code: </strong>
                        <span> {address.postalCode}</span>
                    </div>
                    <div className="ship-address-row">
                        <strong>Country: </strong>
                        <span> {address.country}</span>
                    </div>
                </div>
            ))}
            <div
                key={addresses.length}
                className={
                    `ship-address-card rounded-0 d-flex align-items-center justify-content-center
                    ${selectedAdd === addresses.length ? "border-primary bg-light" : ""}`
                }
                onClick={() => setSelectedAdd(addresses.length)}
            >
                    <i 
                        className={
                            `bi bi-plus-circle fs-1
                            ${selectedAdd === addresses.length ? "text-primary" : "text-secondary"}`
                        }
                    >
                    </i>
            </div>
        </div>
    )
}