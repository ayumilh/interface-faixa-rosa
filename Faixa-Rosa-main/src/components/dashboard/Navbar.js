// src/components/Navbar.js
"use client";

import React from "react";
import Link from 'next/link';
import { FaHome, FaUser, FaBell, FaCog } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-pink-500 text-2xl font-bold">
          SaaS Dashboard
        </Link>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-pink-500 flex items-center">
            <FaHome size={20} />
          </Link>
          <Link href="/perfil" className="text-gray-700 hover:text-pink-500 flex items-center">
            <FaUser size={20} />
          </Link>
          <Link href="#" className="text-gray-700 hover:text-pink-500 flex items-center">
            <FaBell size={20} />
          </Link>
          <Link href="#" className="text-gray-700 hover:text-pink-500 flex items-center">
            <FaCog size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
