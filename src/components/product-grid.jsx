import ProductCard from "./product-card";
import products from "../data/products.json" with {type: "json"};
import { useState } from "react";

function ProductGrid({prod_filter}) {

  prod_filter;

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
              <ProductCard product={product} />
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

export default ProductGrid