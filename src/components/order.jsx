import backendUrl from "../api/backend-info"
import webClient from "../api/web-client"
import { useState, useEffect } from "react"

export default function OrderPage({user}) {

    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(null);
    
    // useEffect(()=>{
    //     const loadData = async ()=>{
    //         const response = await webClient.get("/api/orders/get-order");
    //         setOrders(response.data);
    //     }
    //     loadData();   
    // },[refresh])

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await webClient.get("/api/orders/get-order");
            setOrders(response.data);
        }, 500);

        return () => clearInterval(interval);
    }, []);

 
    if(orders.length===0){
        return(
            <h1 className="mt-4">You have no order</h1>
        )
    }

    // console.log(orders);

    return(
        
        <div>
            {orders.map((order,index)=>

                // Order card
                <div key={index} className="card shadow-sm rounded-0 mb-4">

                    <div className="card-body p-4">
                        <h5 className="fw-semibold mb-3 text-secondary">
                            ORDER ID: {order.orderId.toUpperCase()}
                        </h5>
                        {/** Header */}
                        <div className="row py-3 border-bottom text-secondary small fw-bold">
                            <div className="col-lg-3">PRODUCTS IN CART</div>
                            <div className="col-lg-2">SHOP ID</div>
                            <div className="col-lg-2">TRACKING-NUMBER</div>
                            <div className="col-lg-2">SHIPPING STATUS</div>
                        </div>
                        {
                            order.orderShipmentDTOList.map((shipment,index)=>

                                // Shipment charts
                                <div key={index} className="row border-bottom align-items-center py-3">
                                    <div className="col-lg-3 d-flex align-items-center">
                                        {
                                            shipment.orderItemDTOList.map((item,index)=>
                                                index<4&&<div key={index}
                                                    className="d-flex align-items-center justify-content-center ms-2"
                                                    style={{ width: "45px", minWidth: "45px" }}
                                                >
                                                    <img
                                                        src={backendUrl+'/public/images/'+item.image}
                                                        alt={item.productName}
                                                        className="img-fluid"
                                                    />
                                                </div>
                                            )
                                        }
                                        {shipment.orderItemDTOList.length>4&&<p className="ms-3">...</p>}
                                    </div>

                                    <div className="col-lg-2 fw-medium text-secondary">
                                        <p className="mb-0">{shipment.shopId.slice(0,18).toUpperCase()}</p>
                                    </div>
                                    <div className="col-lg-2 fw-medium text-secondary">
                                        {shipment.trackingNumber?
                                            <p className="mb-0">{shipment.trackingNumber.slice(0,18).toUpperCase()}</p>:
                                            <p className="mb-0">no data</p>
                                        }
                                    </div>
                                    <div className="col-lg-2 fw-medium text-secondary">
                                        <p className="mb-0">{shipment.shipmentStatus.toLowerCase()}</p>
                                    </div>
                                </div>
                            )
                            
                        }

                        {/* <!-- Order status info --> */}
                        <div className="my-3">
                            <div className="d-flex align-items-center gap-2 mb-1 text-secondary">
                                <span className="fs-5">🚚</span>
                                <span>
                                    ORDER STATUS:
                                </span>
                            </div>

                            <div className="row mb-1">
                                {/* <!-- Progress bar marking --> */}
                                <div className="col-lg-2 text-secondary">PENDING</div>
                                <div className="col-lg-2 text-secondary">CONFIRMED</div>
                                <div className="col-lg-2 text-secondary">PROCESSED</div>
                                <div className="col-lg-2 text-secondary">SHIPPED</div>
                                <div className="col-lg-2 text-secondary">DELIVERED</div>
                            </div>

                            <div className="row">
                                {/* <!-- Progress bar --> */}
                                <div className="col-lg-9">

                                    <div className="progress rounded-0" style={{ height: "8px" }}>
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${calcBar(order.orderStatus)}%` }}
                                            aria-valuenow={`${order.orderStatus}`}
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                        </div>
                                    </div>

                                </div>

                                {/* Payment & Cancel buttons */}
                                {order.paymentStatus==="FAILED"&&<div className="col-lg-3 row gap-2 justify-content-end">
                                    <button 
                                        type="button"
                                        className="btn btn-secondary rounded-0 col-lg-5"
                                        onClick={async ()=>{
                                            if(order){
                                                await webClient.delete("/api/orders/cancel/"+order.orderId);
                                            }
                                            setRefresh(prev=>prev+1);
                                        }}
                                    >
                                        Cancel order
                                    </button>

                                    <button 
                                        className="btn btn-danger rounded-0 col-lg-5"
                                        data-bs-toggle="modal"
                                        data-bs-target="#paymentModal"
                                    >
                                        Payment
                                    </button>
                                </div>}

                            </div>

                        </div>
                    </div>

                </div>
            )}
        </div>
        
    )

}

function calcBar(orderStatus){
    if(orderStatus==="PENDING") return 0;
    if(orderStatus==="CONFIRMED") return 25;
    if(orderStatus==="PROCESSING") return 50;
    if(orderStatus==="SHIPPED") return 75;
    if(orderStatus==="DELIVERED") return 100;
}