import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import ProductGrid from './components/product-grid'
import StoreLayout from './layouts/store-layout'
import ProductDetail from './components/product-detail'
import PlaceOrder from './components/place-order'
import LoginModal from './components/login-modal'
import LogoutModal from './components/logout-modal'
import ContinueModal from './components/continue-modal'
import Cart from './components/shopping-cart'
import webClient from './api/web-client'

export default function App() {

  const [user, setUser] = useState(null);
  
  return(
    <>
      <Routes>
        {/* Store pages */}
        <Route path='/' element={<StoreLayout user={user} />}>
          <Route index element={<ProductGrid/>} />
          <Route path='/all' element={<ProductGrid/>} />
          <Route path='/products/:id' element={<ProductDetail user={user}/>} />
          <Route path='/cart' element={<Cart user={user}/>} />
          <Route path='/place-order' element={<PlaceOrder user={user}/>} />
        </Route>
      </Routes>

      <LoginModal setUser={setUser}/>
      <LogoutModal setUser={setUser}/>
      <ContinueModal user={user}/>
    </>
  )

}
