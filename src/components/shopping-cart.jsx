import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import webClient from "../api/web-client";
import backendUrl from "../api/backend-info";
import "../styles/cart-container.css"

export default function Cart({user}){

    // get products from backend
    const [cart, setCart] = useState(null);
    const [inventoryList, setInventoryList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(()=>{
        const loadData = async () => {
            try {
                /** get cart */
                const response1 = await webClient.get("/api/carts/get-cart");
                
                setCart(response1.data);
                
                /** get item inventory list */
                const productIdList = response1.data.cartItemResponseDTOList.map(ci=>ci.productId);

                const response2 = await Promise.all(
                    productIdList.map(async (pid)=>{
                        const response = await webClient.get("/public/items/get-prod-items/"+pid);
                        return response.data;
                    })
                )

                setInventoryList(response2);

            } catch (error) {
                if(error.response?.status===400){
                    setCart([]);
                }
            }

            
        };
        loadData();
    },[refresh]);

    if(!cart){
        return(
            <p>Loading...</p>
        )
    }else if(cart.length===0){
        return(
            <h1 className="mt-4">You have no article in the shopping cart</h1>
        )
    }

    if(inventoryList.length===0){
        return(
            <p>Loading...</p>
        )
    }

    const cartItemList = cart.cartItemResponseDTOList;
    const cartSum = cart.cartSumResponseDTO;
    // console.log(cartSum);

    return(
        cartItemList.length===0?(
            <h1 className="mt-4">You have no article in the shopping cart</h1>
        ):(
            <div className="cart-container">
                {/** Header */}
                <div className="row py-3 border-bottom text-secondary small fw-bold">
                    <div className="col-lg-5">PRODUCTS IN CART</div>
                    <div className="col-lg-1">SIZE</div>
                    <div className="col-lg-2">AVAILABILITY</div>
                    <div className="col-lg-1">QUANTITY</div>
                    <div className="col-lg-1">UNIT PRICE</div>
                    <div className="col-lg-2">PRICE IN TOTAL</div>
                </div>
                
                {/** Products */}
                {cartItemList.map((cartItem, index)=>{
                    return <CartItem  key={cartItem.id} cartItem={cartItem} cartItemList={cartItemList} inventoryItemList={inventoryList[index]} setRefresh={setRefresh} setCart={setCart}/>
                })}
                
                {/** Shipping cost banner */}
                <ShippingCost cartSum={cartSum}/>
            </div>
        )
    )

}

function CartItem({cartItem,cartItemList,inventoryItemList,setRefresh,setCart}) {
    // console.log(cartItem)
    // console.log(inventoryItemList)
    return(
        <div className="row align-items-center py-4 border-bottom g-3">
            {/* Product Info */}
            <div className="col-12 col-lg-5 d-flex align-items-center">

                {/* Product image */}
                <div
                    className="me-3 align-items-center justify-content-center cart-image-container"
                >
                    <img
                        src={backendUrl+'/public/images/'+cartItem.image}  
                        alt={cartItem.name}
                    />
                </div>

                {/* Product name */}
                <div>
                    <a
                    href="#"
                    className="text-decoration-none text-dark fw-semibold"
                    >
                    {cartItem.productName}
                    </a>
                </div>
            </div>

            {/* Size */}
            <div className="col-6 col-lg-1">
                <select 
                    className="form-select square-select"
                    defaultValue={cartItem.size}
                    onChange={async (e)=>{
                        if(e.target.value!=cartItem.size){
                            const matchingItems = cartItemList.filter(item => 
                                (item.productId === cartItem.productId)&&(item.itemId!=cartItem.itemId)
                            );

                            // console.log(matchingItems);

                            if(matchingItems){
                                const matchingSize = matchingItems.filter(item => 
                                    item.size === e.target.value
                                );

                                /** if target item exists */
                                if(matchingSize.length!=0){
                                    const matchItem = {...matchingSize[0]};

                                    matchItem.quantity = Math.min(matchItem.available-matchItem.quantity,cartItem.quantity)

                                    // console.log("Target size:"+matchItem.size+" Target quantity: "+matchItem.quantity);

                                    if(matchItem.quantity>0){
                                        await webClient.post("/api/carts/add-item", matchItem);
                                    }
                                    await webClient.delete("/api/carts/delete-item/"+cartItem.id);
                                    setCart(null);
                                    setRefresh(prev=>prev+1);
                                } 
                                /** if target item does not exist */
                                else {

                                    // console.log("size of original item: "+cartItem.size+" quantity: "+cartItem.quantity);

                                    const matchInv = inventoryItemList.find(item => item.size === e.target.value);
                                    
                                    const oldItemId = cartItem.id;
                                    const newItem = {...cartItem};
                                    newItem.itemId = matchInv.id;
                                    newItem.size = matchInv.size;
                                    newItem.id = null;

                                    // console.log("size of target item: "+matchInv.size+" quantity: "+Math.min(newItem.quantity,matchInv.quantity));

                                    newItem.quantity = Math.min(newItem.quantity,matchInv.quantity);
                                    newItem.available = matchInv.quantity;
                                    await webClient.post("/api/carts/add-item", newItem);
                                    await webClient.delete("/api/carts/delete-item/"+oldItemId);
                                    setCart(null);
                                    setRefresh(prev=>prev+1);
                                }
                            } 
                        }
                    }}
                >
                    {inventoryItemList.map(inv=>{
                        return(
                            <option value={inv.size} key={inv.size}>
                                {inv.size}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* Availability */}
            <div className="col-6 col-lg-2">
                {
                    cartItem.available>5&&
                    <span className="badge bg-success mb-1 rounded-0">
                        In stock
                    </span>
                }
                {
                    cartItem.available>0&&cartItem.available<=5&&
                    <span className="badge bg-warning mb-1 rounded-0">
                        Only {cartItem.available} In stock
                    </span>
                }
                {
                    cartItem.available==0&&
                    <span className="badge bg-danger mb-1 rounded-0">
                        Not available
                    </span>
                }

                <div className="small text-muted">
                    delivery within
                    <br />
                    {`${cartItem.daysOfDelivery} days`}
                </div>
            </div>

            {/* Quantity */}
            <div className="col-6 col-lg-1">
              <div className="btn-group">

                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-0"
                  onClick={
                    async () => {
                        await webClient.patch(`/api/carts/minus-item/${cartItem.id}`)
                        setRefresh(prev=>prev+1);
                    }
                  }
                >
                  −
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  disabled
                >
                  {cartItem.quantity}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-0"
                  onClick={
                    async () => {
                        if(cartItem.quantity<cartItem.available){
                            await webClient.patch(`/api/carts/plus-item/${cartItem.id}`)
                            setRefresh(prev=>prev+1);
                        }                        
                    }
                  }
                >
                  +
                </button>

              </div>
            </div>

            {/* Price */}
            <div className="col-6 col-lg-1">
              <span className="fw-semibold d-block text-center">
                {
                    cartItem.discountPrice?(
                        <>
                            <p className="text-decoration-line-through mb-0 small text-secondary">
                                ${cartItem.unitPrice}
                            </p>
                            <p className="text-primary fs-5">
                                ${cartItem.discountPrice}
                            </p>
                        </>
                        
                    ):(
                        <p className="text-dark fs-5 mt-3"
                        >
                            ${cartItem.unitPrice}
                        </p>
                    )
                    
                }
              </span>
            </div>

            {/* Total */}
            <div className="col-12 col-lg-2">
              <div className="d-flex align-items-center justify-content-between">
                <span className="fw-semibold d-block text-center mt-3">
                {
                    cartItem.discountPrice?(
                        <>
                            <p className="text-primary fs-5">
                                ${cartItem.discountPrice*cartItem.quantity}
                            </p>
                        </>
                        
                    ):(
                        <p className="text-primary fs-5"
                        >
                            ${cartItem.unitPrice*cartItem.quantity}
                        </p>
                    )
                }
                </span>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-0"
                  aria-label="Produkt entfernen"
                  onClick={
                    async () => {
                        await webClient.delete(`/api/carts/delete-item/${cartItem.id}`)
                        setRefresh(prev=>prev+1);
                    }
                  }
                >
                  ×
                </button>

              </div>
            </div>
            
        </div>
    )
}

function ShippingCost({cartSum}){
    const navi = useNavigate();
    return(
        <div className="container my-5">
            <div className="card border-0 shadow-sm rounded-0">
                <div className="card-body">

                    {/* <!-- Shipping info --> */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
                            <span className="fs-5">🚚</span>
                            <span>
                                {
                                    (cartSum.total-cartSum.shippingCost)>=cartSum.shippingFreeTotal?(
                                        <>
                                            Shipping is free.
                                        </>
                                    ):(
                                        <>
                                            Buy
                                            <strong className="text-dark"> ${cartSum.shippingFreeTotal-cartSum.total+cartSum.shippingCost} </strong>
                                            more for free shipping.
                                        </>
                                    )
                                }
                            </span>
                        </div>

                        {/* <!-- Progress bar --> */}
                        <div className="progress rounded-0" style={{ height: "8px" }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${((cartSum.total-cartSum.shippingCost)/cartSum.shippingFreeTotal*100).toFixed(2)}%` }}
                                aria-valuenow={`${((cartSum.total-cartSum.shippingCost)/cartSum.shippingFreeTotal*100).toFixed(2)}`}
                                aria-valuemin="0"
                                aria-valuemax="100">
                            </div>
                        </div>
                    </div>

                    {/* <!-- Total --> */}
                    <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                        <div>
                            <strong className="d-block">Total price</strong>
                            <small className="text-muted">VAT included</small>
                        </div>

                        <div>
                            <strong className="fs-2">{`$${cartSum.total-cartSum.shippingCost}`}</strong>
                            
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* continue with order button */}
            <div className="d-flex justify-content-end mt-3">
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