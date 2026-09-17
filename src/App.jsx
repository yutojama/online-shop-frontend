import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import ProductGrid from './components/product-grid'
import FilteredProductGrid from './components/filtered-product-grid'
import StoreLayout from './layouts/store-layout'
import ProductDetail from './components/product-detail'
import PlaceOrder from './components/place-order'
import OrderPage from './components/order'
import ShopOrder from './components/shop-order'
import LoginModal from './components/login-modal'
import LogoutModal from './components/logout-modal'
import ContinueModal from './components/continue-modal'
import PaymentModal from './components/payment-modal'
import Cart from './components/shopping-cart'
import ProductList from './components/product-list'
import ProductShopDetail from './components/product-shop-detail'
import webClient from './api/web-client'

export default function App() {

  const [user, setUser] = useState(()=>{
    // localStorage.clear();
    const storedUser = localStorage.getItem("user");

    if(storedUser){return JSON.parse(storedUser)};

    return null;
  });
  const [order, setOrder] = useState(null);
  
  return(
    <>
      <Routes>
        {/* Store pages */}
        <Route path='/' element={<StoreLayout user={user} />}>
          <Route path='/' element={<ProductGrid user={user}/>} />
          <Route path='/*' element={<FilteredProductGrid user={user}/>} />
          <Route path='/all' element={<ProductGrid/>} />
          <Route path='/products/:id' element={<ProductDetail user={user}/>} />
          <Route path='/cart' element={<Cart user={user}/>} />
          <Route path='/place-order' element={<PlaceOrder user={user} setOrder={setOrder}/>} />
          <Route path='/order' element={<OrderPage user={user}/>} />
          <Route path='/shop-order' element={<ShopOrder user={user}/>} />

          <Route path='/shop/product-list' element={<ProductList user={user}/>} />
          <Route path='/shop/products/:id' element={<ProductShopDetail user={user}/>} />
        </Route>
      </Routes>

      <LoginModal setUser={setUser}/>
      <LogoutModal setUser={setUser}/>
      <ContinueModal user={user}/>
      <PaymentModal user={user} order={order}/>
    </>
  )

}
