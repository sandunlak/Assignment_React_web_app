"use client"

import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div 
      className="h-screen w-screen fixed inset-0 bg-cover bg-center bg-no-repeat overflow-auto"
      style={{ backgroundImage: `url('https://i.postimg.cc/4N7M2stT/pin-12.jpg')` }}
    >
      {/* Header */}
      <header className="w-full bg-teal-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">ShopWorld</h1>
          <nav className="flex space-x-4 items-center">
            
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-end h-[calc(60vh-64px)] pb-20">
        <Link
          to="/dashboard"
          className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  )
}

export default Home