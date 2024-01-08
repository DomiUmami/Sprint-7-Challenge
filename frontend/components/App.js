import React, { useState, useEffect } from 'react'
import Home from './Home'
import Form from './Form'
import { Routes, Route, NavLink } from 'react-router-dom'

function App() {







  return (
    <div id="app">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Order" element={<Form />} />

      </Routes>
     
    
    </div>
  )
}

export default App
