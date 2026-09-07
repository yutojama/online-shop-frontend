import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import webClient from "../api/web-client";
import backendUrl from "../api/backend-info";
import "../styles/product-detail.css";



const sizes = ["S", "M", "L", "XL"];

export default function ProductDetail({user}) {
    const {id} = useParams();
     // get product and items from backend
    const [product, setProduct] = useState(null);
    const [items, setItems] = useState([]);
    const [selectSize, setSelectSize] = useState(null);

    useEffect(()=>{
        webClient.get("/public/products/get-prod/"+id)
        .then(response=>{
            setProduct(response.data)
        })
        webClient.get("/public/items/get-prod-items/"+id)
        .then(response=>{
            setItems(response.data)
        })
    },[id]);

    
    
    // display loading when product is not yet loaded
    if (!product) {
        return <p>Loading...</p>;
    }

    // get available sizes from product items
    const availableSizes = items.map(item => item.size);

    // find stock number of selected size
    let stockItem = items.find(item => item.size === selectSize);
    const stockQuantity = stockItem!=undefined?stockItem.quantity:product.quantity;
    // specify stock text style
    const stockTextStyle = (stock)=>{
        if(stock===0) return "text-danger";
        if(stock<=3) return "text-warning";
        return "text-success"
    }

    return (
        <div className="container py-3">
            <div className="d-flex flex-row gap-5">
                {/** Image */}
                <div className="d-flex flex-column justify-content-center product-image-container mx-5">
                    <img
                        src={backendUrl+'/public/images/'+product.image}  
                        alt={product.name}
                    />

                    {/** tags above image */}
                    <span className="product-action-label">
                        ACTION PRICE
                    </span>
                    <span className="product-gender-label">
                        {product.gender==="M"&&<i className="bi bi-gender-male fs-3"></i>}
                        {product.gender==="W"&&<i className="bi bi-gender-female fs-3"></i>}
                    </span>
                </div>

                {/* product info from here */}
                <div className="d-flex flex-column gap-4">
                    {/* description */}
                    <div>
                        <p className="text-black fs-2 w-75">
                            {product.description}
                        </p>
                        <p className="text-muted fs-4">
                            {"Brand: "+product.brand}
                        </p>
                    </div>

                    {/* size */}
                    <div className="d-flex flex-column">

                        <p className="text-muted fs-7 mb-0">
                            {`ArtikleNr: ${product.brand}-${product.category}-${product.gender}-${product.id?.slice(0,8)}`}
                        </p>

                        <p className="text-muted fs-7">
                            Select your size:
                        </p>

                        <p className="text-danger fs-7 fw-medium">
                            {selectSize==='N'&&"Size required for order"}
                        </p>

                        <div className="size-selector">
                            {sizes.map((item) => {
                                const available = availableSizes.includes(item);
                                
                                return(
                                    <button
                                        key={item}
                                        type="button"
                                        disabled={!available}
                                        className={`size-box ${
                                            selectSize === item ? "selected" : ""
                                        }`}
                                        onClick={() => {
                                            // if selected size is equal to button size, then unselect button
                                            selectSize === item?setSelectSize('N'):setSelectSize(item);
                                        }}
                                    >
                                        {item}
                                    </button>
                                )
                                
                            })}
                        </div>

                    </div>

                    {/* price and shipping info */}
                    <div className="d-flex flex-column">
                        <p className={stockTextStyle(stockQuantity)+" mb-0"}>
                            {`${stockQuantity} in stock`}
                        </p>
                        <p>
                            {`Delivery in ${product.daysOfDelivery} days`}
                        </p>

                        <div className="bg-body-secondary p-4 row align-items-center">
                            {/* price and discount */}
                            <div className="col-4">
                                {product.discountPrice===null ? (
                                        <p className="text-dark fw-bold fs-3">${product.origPrice}</p>
                                    ):(
                                        <>
                                            <p className="text-decoration-line-through mb-0 small text-secondary">${product.origPrice}</p>
                                            <p className="mb-0 text-dark fw-bold fs-3">${product.discountPrice}</p>
                                        </>
                                )}
                                <p className="m-0 small text-secondary">VAT included.</p>
                            </div>
                            {/** in shopping cart button */}
                            <div className="col-8 d-flex justify-content-center">
                                <InShopCartButton user={user} product={product} stockItem={stockItem} setSelectSize={setSelectSize}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InShopCartButton({user,product,stockItem,setSelectSize}){
    return(
        user?(
            stockItem===undefined?(
                <button
                    className="btn btn-danger rounded-0 py-3 px-5"
                    type="button"
                    onClick={()=>{
                        setSelectSize('N');
                    }}
                >
                    IN SHOPPING CART
                </button>
            ):(
                <button 
                    className="btn btn-danger rounded-0 py-3 px-5"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#continueModal"
                    onClick={()=>{
                            stockItem&&webClient.post("/api/carts/add-item",
                                {
                                    "shopId":product.shopId,
                                    "quantity":1,
                                    "size":stockItem.size,
                                    "itemId":stockItem&&stockItem.id,
                                    "productId":product.id,
                                    "productName":product.description,
                                    "image":product.image,
                                    "unitPrice":product.origPrice,
                                    "discountPrice":product.discountPrice,
                                    "daysOfDelivery":product.daysOfDelivery,
                                    "available":stockItem.quantity
                                }
                            )
                        }
                    }
                >
                    IN SHOPPING CART
                </button>
            )
        ):(
            <button 
                className="btn btn-danger rounded-0 py-3 px-5"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
            >
                IN SHOPPING CART
            </button>
        )
    )
}