import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Header'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProductDetails from './pages/ProductDetails'
import './App.css'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
