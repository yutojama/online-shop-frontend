import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import ProductGrid from './components/product-grid'
import StoreLayout from './layouts/store-layout'
import ProductDetail from './components/product-detail'

export default function App() {

  return(
    <Routes>
      {/* Store pages */}
      <Route path='/' element={<StoreLayout />}>
        <Route index element={<ProductGrid/>} />
        <Route path='/all' element={<ProductGrid/>} />
        <Route path='/products/:id' element={<ProductDetail/>} />
      </Route>
    </Routes>
  )

}
