// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
const image = require('../assets/logo.jpg')
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-800  p-6  flex justify-between items-center ">
      <div
        className="flex items-center text-white cursor-pointer"
        onClick={() => navigate("/?page=1&search")}
      >
        <img src={image} alt="Logo" className="h-10 w-10 mr-2 rounded-full" />
        <span className="text-xl font-semibold">GHSS Mattannur</span>
      </div>
    </nav>
  );
};

export default Navbar;
