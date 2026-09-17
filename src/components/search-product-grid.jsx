import ProductCard from "./product-card";
import webClient from "../api/web-client";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchProductGrid() {

  const {keyword} = useParams();

  // get products from backend
  const [products, setProdutcts] = useState([]);
  useEffect(()=>{
    webClient.get("/public/products/search/"+keyword)
    .then(response=>{
      setProdutcts(response.data)
    })
  },[keyword]);

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // Calculate product range
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = products.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(products.length / productsPerPage);

  // sliding window for pagination
  const maxButtons = 5;

  const startPage = Math.max(
    1,
    currentPage - Math.floor(maxButtons / 2)
  );

  const endPage = Math.min(
    totalPages,
    startPage + maxButtons - 1
  );

  return (
    <>
      {/* Grid panel */}

      <main className="container py-4">

        <div className="row g-4">

          {currentProducts.map((product) => (

            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              key={product.id}
            >
              <Link
                to={'/products/'+product.id}
                className="text-decoration-none"
              >
                <ProductCard product={product} />
              </Link>
            </div>

          ))}

        </div>

        {/* Pagination buttons */}
        <div className="d-flex justify-content-center mt-4">
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
            const page = startPage + index;
            return (
              <button
                key={page}
                className={`btn ${
                  currentPage === page
                    ? "btn-dark"
                    : "btn-outline-dark"
                } mx-1 rounded-0`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          })}
        </div>

      </main>
    </>
  );
}
