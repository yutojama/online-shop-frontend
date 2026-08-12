import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import ProductGrid from './components/product-grid'
import StoreLayout from './layouts/store-layout'

export default function App() {

  const [dataRefresh, setDataRefresh] = useState(false);

  return(
    <Routes>
      {/* Store pages */}
      <Route path='/' element={<StoreLayout />}>
        <Route index element={<ProductGrid/>} />
        <Route path='all' element={<ProductGrid/>} />
      </Route>
    </Routes>
  )
}
