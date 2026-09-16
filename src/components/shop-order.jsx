import { useState, useEffect } from "react"
import webClient from "../api/web-client";
import backendUrl from "../api/backend-info";


const width1 = 4;
const width2 = 3;
const width3 = 1;
const width4 = 2;
const width5 = 2;

export default function ShopOrder({user}) {

    const [orders, setOrders] = useState(null);

    useEffect(()=>{

        const loadData = async ()=>{
            const response = await webClient.get("/api/orders/shop/get-order/"+user.userId);
            setOrders(response.data);
        }
        loadData();        

    },[])

    if(!orders){
        return(
            <h1 className="mt-4">Loading ...</h1>
        )
    }

    if(orders.length===0){
        return(
            <h1 className="mt-4">You have no order</h1>
        )
    }

    return(
        <div>
            {
                orders.map((order,index)=> <Order key={index} order={order}/>)
            }
        </div>
    )
    
}

function Order({order}){

    // console.log(order);

    return(
        <div className="card shadow-sm rounded-0 mb-4">

            <div className="card-body p-4">
                <h5 className="fw-semibold mb-3 text-secondary">
                    ORDER ID: {order.orderId.toUpperCase()}
                </h5>
                {/** Header */}
                <div className="row py-3 border-bottom text-secondary small fw-bold">
                    <div className={`col-lg-${width1}`}>PRODUCT</div>
                    <div className={`col-lg-${width2}`}>STATUS CHANGE</div>
                    <div className={`col-lg-${width3}`}>CHANGED BY</div>
                    <div className={`col-lg-${width4}`}>REASON</div>
                    <div className={`col-lg-${width5}`}>CHANGED AT</div>
                </div>

                {order.itemChangeRecords.map((item,index)=>
                    <Item key={index} record={item}/>
                )}

            </div>
        </div>
    )
    
}

function Item({record}){
    const histories = record.itemHistories;
    return(
        <div>
            <div className="row py-3 text-secondary small fw-bold">
                <div className={`col-lg-${width1} d-flex align-items-start pb-3`}>
                    {/* Product image */}
                    <div
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{ width: "45px", height: "45px"}}
                    >
                        <img
                            src={backendUrl+'/public/images/'+record.image}
                            alt={record.productName}
                            className="img-fluid"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain"
                            }}
                        />
                    </div>
                    {`${record.productName} - ${record.size} x ${record.quantity}`}
                </div>
                <div className={`col-lg-${width2}`}>{histories[0].toStatus}</div>
                <div className={`col-lg-${width3}`}>{histories[0].changedBy}</div>
                <div className={`col-lg-${width4}`}>{histories[0].reason}</div>
                <div className={`col-lg-${width5}`}>{convertDate(histories[0].changedAt)}</div>
            </div>
            {histories.map((hist,index)=>{
                if(index!=0){
                    return(
                        <div className={`row py-3 ${index===histories.length-1&&"border-bottom"} text-secondary small fw-bold`}>
                            <div className={`col-lg-${width1}`}></div>
                            <div className={`col-lg-${width2}`}>{`${hist.fromStatus} - ${hist.toStatus}`}</div>
                            <div className={`col-lg-${width3}`}>{hist.changedBy}</div>
                            <div className={`col-lg-${width4}`}>{hist.reason}</div>
                            <div className={`col-lg-${width5}`}>{convertDate(hist.changedAt)}</div>
                        </div>
                    )
                }
            })}
        </div> 
    )
}

function convertDate(myDate){
    const date = new Date(myDate);
    const formatted = date.toISOString();
    return formatted;
}