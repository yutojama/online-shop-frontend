import ProductCard from "./product-card";
import webClient from "../api/web-client";
import { Link, useParams } from "react-router-dom";
import "../styles/double-slider.css";

import { useEffect, useState } from "react";

export default function FilteredProductGrid() {

  // get filter from param
  const params = useParams("filter");
  const prodFilter = params["*"].split("/");
  // console.log(prodFilter);

  // get products from backend
  const [products, setProdutcts] = useState([]);
  const [priceFilterActive, setPriceFilterActive] = useState(false);
  const [rankOptionActive,setRankOptionActive] = useState(false);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [lowerBound, setLowerBound] = useState(null);
  const [upperBound, setUpperBound] = useState(null);
  const [filterUrl, setFilterUrl] = useState(null);
  const [rankOption, setRankOption] = useState(null);
  const [refresh, setRefresh] = useState(null);

  useEffect(()=>{

    const loadData = async ()=>{

      let response = null;
      let fUrl = null;
      if(prodFilter.length===2){
        fUrl = `/public/products/get-filter-prods?gender=${prodFilter[0]}&cat=${prodFilter[1]}`;
      }else if(prodFilter.length===1){
        fUrl = `/public/products/get-filter-prods?cat=${prodFilter[0]}`;
      }

      setFilterUrl(fUrl);

      response = await webClient.get(fUrl);
      setProdutcts(response.data);

      const prods = response.data;
      const priceList = prods.map(prod=>prod.discountPrice?prod.discountPrice:prod.origPrice);
      setMinPrice(Math.min(...priceList));
      setMaxPrice(Math.max(...priceList));
      setLowerBound(Math.min(...priceList));
      setUpperBound(Math.max(...priceList));

      setPriceFilterActive(false);
      setRankOptionActive(false);

    }
    loadData();
  },[prodFilter, refresh]);

  useEffect(()=>{

    const loadData = async ()=>{
      
      let fUrl = filterUrl;
      if(lowerBound||upperBound){
        if(lowerBound) fUrl += `&minPrice=${lowerBound}`;
        if(upperBound) fUrl += `&maxPrice=${upperBound}`;
        const response = await webClient.get(fUrl);
        
        const prods = response.data;

        // sort products by price
        let sortProds = null;
        if(rankOption===0){
          sortProds=[...prods].sort(
            (a,b)=>a.realPrice-b.realPrice
          );
        } else if(rankOption===1){
          sortProds=[...prods].sort(
            (a,b)=>b.realPrice-a.realPrice
          )
        }

        // console.log(sortProds);
        rankOption===null?setProdutcts(prods):setProdutcts(sortProds);
        
      }

    }
    loadData();
  },[lowerBound, upperBound, rankOption]);


  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

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
      <div className="container py-0 d-flex gap-4">
        <div>
          <FilterPanel 
            priceFilterActive={priceFilterActive} 
            setPriceFilterActive={setPriceFilterActive}
            rankOptionActive={rankOptionActive}
            setRankOptionActive={setRankOptionActive}
            minPrice={minPrice} 
            maxPrice={maxPrice}
            lowerBound={lowerBound}
            upperBound={upperBound}
            setLowerBound={setLowerBound}
            setUpperBound={setUpperBound}
            rankOption={rankOption}
            setRankOption={setRankOption}
            setRefresh={setRefresh}
          />
        </div>
        <div className="mb-4 flex-grow-1">
          <ProdPanel 
            prodFilter={prodFilter} 
            currentProducts={currentProducts} 
            endPage={endPage} startPage={startPage} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}

function FilterPanel({
  priceFilterActive,
  setPriceFilterActive,
  rankOptionActive,
  setRankOptionActive,
  minPrice, 
  maxPrice, 
  upperBound, 
  lowerBound, 
  setLowerBound, 
  setUpperBound, 
  rankOption,
  setRankOption, 
  setRefresh}){
  return(
    <div className="card rounded-0 border-0" style={{ width: "220px" }}>

      {/* Header */}
      <div className="bg-black text-white px-4 py-4">
          <h6 className="mb-0">Product filter</h6>
      </div>

      {/* Filters */}
      <div className="border border-top-0">

          {/* Price */}
          <div
              className="d-flex justify-content-between align-items-center px-4"
              onClick={()=>{
                priceFilterActive?setPriceFilterActive(false):setPriceFilterActive(true);
              }}
              style={{
                  height: "61px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer"
              }}
          >
              <span className="fw-semibold">Price</span>

              <span className="text-secondary">⌄</span>

          </div>

          {priceFilterActive&&
            <PriceSlider 
              minPrice={minPrice} 
              maxPrice={maxPrice}
              upperBound={upperBound}
              lowerBound={lowerBound}
              setLowerBound={setLowerBound} 
              setUpperBound={setUpperBound}
            />
          }

          {/* Ranking Option */}
          <div
              className="d-flex justify-content-between align-items-center px-4"
              onClick={()=>{
                rankOptionActive?setRankOptionActive(false):setRankOptionActive(true);
              }}
              style={{
                  height: "61px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer"
              }}
          >
              <span className="fw-semibold">Ranking Option</span>
              <span className="text-secondary">⌄</span>
          </div>

          {rankOptionActive&&
            <RankOption 
              rankOption={rankOption}
              setRankOption={setRankOption}
            />
          }

      </div>

      {/* Reset button */}
      <button
          className="btn btn-outline-secondary rounded-0 w-100 mt-2"
          style={{
              height: "50px",
              letterSpacing: "3px",
              fontSize: "12px",
              fontWeight: "600"
          }}
          onClick={()=>setRefresh(prev=>prev+1)}
      >
          CLEAR FILTER
      </button>

    </div>
  )
}

function PriceSlider({minPrice,maxPrice,lowerBound,upperBound,setLowerBound,setUpperBound}){

  const [tempLowerBound, setTempLowerBound] = useState(minPrice);
  const [tempUpperBound, setTempUpperBound] = useState(maxPrice);

  return(
    <>
        {/* <!-- Slider --> */}
        <div className="container py-4 bg-light border-bottom">
          <div className="d-flex justify-content-between mb-2">
            <span>Min: {minPrice}</span>
            <span>Max: {maxPrice}</span>
          </div>

          <div className="double-slider">
            {/* Background track */}
            <div className="slider-track" />

            {/* Selected range */}
            <div
              className="slider-range"
              style={{
                left: `${(tempLowerBound - minPrice)/(maxPrice - minPrice)*100}%`,
                width: `${(tempUpperBound - tempLowerBound)/(maxPrice - minPrice)*100}%`,
              }}
            />

            {/* Min slider */}
            <input
              type="range"
              min={`${minPrice}`}
              max={`${maxPrice}`}
              value={tempLowerBound}
              onChange={async (e) => {
                const value = Number(e.target.value);
                if (value <= tempUpperBound) setTempLowerBound(value);
              }}
              onMouseUp={() => {
                  setLowerBound(tempLowerBound);
              }}
              onTouchEnd={() => {
                  setLowerBound(tempLowerBound);
              }}
            />

            {/* Max slider */}
            <input
              type="range"
              min={`${minPrice}`}
              max={`${maxPrice}`}
              value={tempUpperBound}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= tempLowerBound) setTempUpperBound(value);
              }}
              onMouseUp={() => {
                  setUpperBound(tempUpperBound);
              }}
              onTouchEnd={() => {
                  setUpperBound(tempUpperBound);
              }}
            />
          </div>

          {/* <!-- Values --> */}
          <div className="d-flex align-items-center justify-content-between px-1">
              <div className="price-value">${tempLowerBound}</div>

              <span className="text-muted">to</span>

              <div className="price-value">${tempUpperBound}</div>
          </div>
        </div>
    </>
  )
}

function RankOption({rankOption, setRankOption}){
  return(
    <div>
      {/* High to low */}
      <label
        key="0"
        className={`row align-items-center g-3 px-3 m-0
            ${setRankOption==0
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
                name="High to low"
                value={0}
                checked={rankOption==0}
                onChange={() => {
                    setRankOption(0);
                }}
                className="form-check-input"
            />
        </div>

        {/* Name */}
        <div className="col-9 col-md flex-grow-1">
            {"High to low"}
        </div>
      </label>

      {/* Low to high */}
      <label
        key="1"
        className={`row align-items-center g-3 px-3 pb-3 m-0
            ${setRankOption==1
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
                name="High to low"
                value={1}
                checked={rankOption==1}
                onChange={() => {
                    setRankOption(1);
                }}
                className="form-check-input"
            />
        </div>

        {/* Name */}
        <div className="col-9 col-md flex-grow-1">
            {"Low to high"}
        </div>
      </label>
    </div>
  )
}

function ProdPanel({prodFilter,currentProducts, endPage, startPage, currentPage, setCurrentPage}){
  return(
    <>
      {/* filter navigation */}
      <div className="mb-4 d-flex">
        <Link 
          className="text-secondary"
          to="/"
        >
          HOME
        </Link>
        {prodFilter.map((filter,index)=>{
          return(
            <div key={index}>
              <span>
                {" -> "}
              </span>
              <span 
                className="text-secondary"
              >
                {filter}
              </span>
            </div>
          )
        })}
      </div>

      <div className="row g-4">

        {currentProducts.map((product) => (

          <div
            className="col-12 col-sm-12 col-md-6 col-lg-4"
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
    </>
  )
}