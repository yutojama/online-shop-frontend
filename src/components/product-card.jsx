import backendUrl from "../api/backend-info";

function ProductCard({ product }) {
  return (
    /* product card as thumbnail */
    <div className="card card-hover h-100 shadow-sm rounded-0  border-0"
        onClick={()=>{
            console.log("card clicked");
        }}
        style={{cursor: "pointer"}}
    >

        {/* card image */}
        <img
            src={backendUrl+'/api/images/'+product.image}  
            className="card-img-top rounded-0 product-image"
            alt={product.name}
        />

        {/* card body */}
        <div className="card-body d-flex flex-column text-center">

            {/* production name and description */}
            <p className="fw-normal fs-6">
                {product.description}
            </p>

            {/* storage and delivering info */}
            {product.amountRemain==0&&<p className="small text-danger">Not available</p>}
            {product.amountRemain>0&&product.amountRemain<=5&&
                <p className="small text-success">
                    {product.amountRemain} in stock, 
                    delivery within {product.daysOfDelivery} days
                </p>}
            {product.amountRemain>5&&
                <p className="small text-success">
                    More than 5 in stock, 
                    delivery within {product.daysOfDelivery} days
                </p>}
            
            {/* show discount while present */}
            {product.discountPrice==null ? (
                    <p className="text-black fw-medium">${product.origPrice}</p>
                ):(
                    <>
                        <p className="text-decoration-line-through mb-0 small text-secondary">${product.origPrice}</p>
                        <p className="text-primary fw-bold">${product.discountPrice}</p>
                    </>
            )}

        </div>

    </div>
  );
}

export default ProductCard;