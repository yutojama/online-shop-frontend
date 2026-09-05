import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import ProductGrid from './components/product-grid'
import StoreLayout from './layouts/store-layout'
import ProductDetail from './components/product-detail'
import LoginModal from './components/login-modal'
import LogoutModal from './components/logout-modal'
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
          <Route path='/products/:id' element={<ProductDetail/>} />
        </Route>
      </Routes>

      <LoginModal setUser={setUser}/>
      <LogoutModal setUser={setUser}/>
    </>
  )

}
