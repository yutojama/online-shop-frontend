import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./product-card";
import webClient from "../api/web-client";

export default function ProductList({user}) {

    // return(
    //     <h1 className="mt-4">You have no article in the product list</h1>
    // )

    // get products from backend
    const [products, setProdutcts] = useState([]);
    
    useEffect(()=>{
        webClient.get("/api/products/get-prods/"+user.userId)
        .then(response=>{
        setProdutcts(response.data)
        })
    },[]);

    return (
        <>
        {/* Grid panel */}

        <main className="container py-4">

            <div className="row g-4">

            {products.map((product) => (

                <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={product.id}
                >
                <Link
                    to={'/shop/products/'+product.id}
                    className="text-decoration-none"
                >
                    <ProductCard product={product} />
                </Link>
                </div>

            ))}

            </div>

        </main>
        </>
    );
}