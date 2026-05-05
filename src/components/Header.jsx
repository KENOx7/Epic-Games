import React, { useState } from 'react'
import logo from "../assets/logo.png"
import store from "../assets/store.svg"
import { Link } from 'react-router-dom'
import { Earth, TextAlignJustify, X, Search, ChevronDown, ChevronUp, Bookmark, Gift, ShoppingCart} from 'lucide-react';

function Header() {
  const [Menu, setMenu] = useState();
  const [DropdownOpen, setDropdownOpen] = useState();
  const [MobileSearchOpen, setMobileSearchOpen] = useState();

  return (
    <div>
      <header className='bg-[#121216] h-[72px] w-full flex items-center justify-between p-5 '>
        <div className='flex items-center gap-5'>
          <img src={logo} alt="logo" className=' h-[40px]' />
          <img src={store} alt="store" className='w-[54px] h-[32px]' />
          <Link to="/" className='text-white hidden md:block text-[16px]'>Support</Link>
          <Link to="/" className='text-white hidden md:block text-[16px]'>Distribute</Link>

        </div>
        <div className='flex items-center gap-5'>
          <Earth className='hidden md:block text-white text-[16px] hover:opacity-60 transition duration-300 cursor-pointer' />
          <button className='hidden md:block text-white text-[16px] bg-[#353539] p-2 w-[71px] rounded-md hover:bg-[#656567] transition duration-300'>Sign In</button>
          <button className='text-[16px]  bg-[#26BBFF] md:p-2 p-1 px-2 rounded-md hover:bg-[#72D3FF] transition duration-300'>Download</button>
          <div onClick={() => setMenu(!Menu)}>
            {Menu ? <X className='md:hidden text-white text-[16px] hover:opacity-60 transition duration-300 cursor-pointer' /> : <TextAlignJustify className='md:hidden text-white text-[16px]  hover:opacity-60 transition duration-300 cursor-pointer' />}
          </div>
        </div>
      </header>

      {/* Hamburger Dropdown */}
      {Menu && (
        <div className="md:hidden bg-[#121216] flex flex-col p-5 gap-6 h-screen">
          <div className='flex justify-end items-center gap-5'>
            <Earth className='text-white text-[16px] hover:opacity-60 transition duration-300 cursor-pointer' />
            <button className='text-white text-[16px] bg-[#353539] p-2 w-[71px] rounded-md hover:bg-[#656567] transition duration-300'>Sign In</button>
          </div>
          <div>
            <ul>
              <li className='text-white text-[32px] font-bold'>Menu</li>
              <li className='text-white text-[16px] pt-10'>Support</li>
              <li className='text-white text-[16px] pt-5'>Distribute</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className='bg-[#101014] h-[100px] w-full'>
        <div className='max-w-[1200px] mx-auto h-full flex justify-between items-center'>
          <div className='flex items-center'>
            {/* Desktop Search */}
            <div className='hidden md:flex items-center'>
              <i className='bg-[#202024] text-[#AEAEAF] w-[40px] h-[40px] rounded-l-full flex items-center justify-center'><Search size={'16px'} /></i>
              <input type="text" placeholder='Search store' className='bg-[#202024] text-[#AEAEAF] text-[16px] w-[190px] h-[40px] rounded-r-full outline-none' />
            </div>
            {/* Mobile Search */}
            <div className='md:hidden flex items-center'>
              <Search className='text-[#AEAEAF] cursor-pointer hover:text-white transition' size={24} onClick={() => setMobileSearchOpen(true)} />
            </div>
            <div className="relative ml-8">
              <button onClick={() => setDropdownOpen(!DropdownOpen)} className="text-white text-[18px] flex items-center gap-2 hover:opacity-80 transition">
                Discover {DropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>

              {DropdownOpen && (
                <div className="absolute top-10 bg-[#18181c] rounded-md shadow-xl py-2 w-[180px]">
                  <ul className="flex flex-col">
                    <li className="text-white text-[16px] hover:bg-[#2a2a30] px-5 py-3 cursor-pointer transition">Discover</li>
                    <li className="text-[#AEAEAF] text-[16px] hover:text-white hover:bg-[#2a2a30] px-5 py-2.5 cursor-pointer transition">Browse</li>
                    <li className="text-[#AEAEAF] text-[16px] hover:text-white hover:bg-[#2a2a30] px-5 py-2.5 cursor-pointer transition">News</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center gap-6 text-[#AEAEAF]'>
            <Bookmark className="hover:text-white cursor-pointer transition" size={20} />
            <Gift className="hover:text-white cursor-pointer transition" size={20} />
            <ShoppingCart className="hover:text-white cursor-pointer transition" size={20} />
          </div>
        </div>
      </div>

      {/* Mobile Search Window*/}
      {MobileSearchOpen && (
        <div className="fixed inset-0 bg-[#121216] flex flex-col p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-[20px] font-bold">Search</h2>
            <button onClick={() => setMobileSearchOpen()} className="text-[#AEAEAF] hover:text-white"><X size={28} /></button>
          </div>
          <div className="flex items-center bg-[#202024] rounded-full px-4 py-3 h-[50px]">
            <Search className="text-[#AEAEAF] mr-3" size={20} />
            <input autoFocus type="text" placeholder="Search store" className="bg-transparent text-white outline-none w-full text-[16px]" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Header