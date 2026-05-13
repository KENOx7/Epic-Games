import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Earth, TextAlignJustify, X, Search, ChevronDown, ChevronUp, Bookmark, ShoppingCart,} from "lucide-react";
import logo from "../assets/logo.png";
import store from "../assets/store.svg";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  useEffect(() => {
    function closeDropdown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <>
      <header className="bg-[#121216] h-[72px] w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-5 hover:opacity-80">
            <img src={logo} alt="logo" className="h-[40px]" />
            <img src={store} alt="store" className="w-[54px] h-[32px]" />
          </Link>

          <Link to="/" className="hidden md:block text-white hover:text-gray-300">
            Support
          </Link>

          <Link to="/" className="hidden md:block text-white hover:text-gray-300">
            Distribute
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Earth className="hidden md:block text-white hover:opacity-60 cursor-pointer" />

          <button className="hidden md:block text-white bg-[#353539] p-2 w-[71px] rounded-md hover:bg-[#656567]">
            Sign In
          </button>

          <button className="bg-[#26BBFF] md:p-2 p-1 px-2 rounded-md hover:bg-[#72D3FF]">
            Download
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white hover:opacity-60"
          >
            {menuOpen ? <X /> : <TextAlignJustify />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden bg-[#121216] fixed inset-0 z-[60] flex flex-col p-5 gap-6">
          <div className="flex justify-between items-center">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img src={logo} alt="logo" className="h-[40px]" />
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="text-white hover:opacity-60"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-end items-center gap-5 mt-4">
            <Earth className="text-white hover:opacity-60 cursor-pointer" />

            <button className="text-white bg-[#353539] p-2 w-[71px] rounded-md hover:bg-[#656567]">
              Sign In
            </button>
          </div>

          <ul>
            <li className="text-white text-[32px] font-bold">Menu</li>
            <li className="text-white pt-10">Support</li>
            <li className="text-white pt-5">Distribute</li>
          </ul>
        </div>
      )}

      <div className="bg-[#101014] h-[100px] w-full sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto h-full flex justify-between items-center px-4 xl:px-0">
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <div className="bg-[#202024] text-[#AEAEAF] w-[40px] h-[40px] rounded-l-full flex items-center justify-center">
                <Search size={16} />
              </div>

              <input
                type="text"
                placeholder="Search store"
                className="bg-[#202024] text-[#AEAEAF] w-[190px] h-[40px] rounded-r-full outline-none"
              />
            </div>

            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden text-[#AEAEAF] hover:text-white"
            >
              <Search size={24} />
            </button>

            <div className="relative ml-8" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white text-[18px] flex items-center gap-2 hover:opacity-80"
              >
                Discover
                {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {dropdownOpen && (
                <div className="absolute top-10 bg-[#18181c] rounded-md shadow-xl py-2 w-[180px] z-50">
                  <ul>
                    <Link to="/" onClick={() => setDropdownOpen(false)}>
                      <li className="text-white hover:bg-[#2a2a30] px-5 py-3 cursor-pointer">
                        Discover
                      </li>
                    </Link>
                    <Link to="/browse" onClick={() => setDropdownOpen(false)}>
                      <li className="text-[#AEAEAF] hover:text-white hover:bg-[#2a2a30] px-5 py-2.5 cursor-pointer">
                        Browse
                      </li>
                    </Link>
                    <li className="text-[#AEAEAF] hover:text-white hover:bg-[#2a2a30] px-5 py-2.5 cursor-pointer">
                      News
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#AEAEAF]">
            <Link
              to="/wishlist"
              className="relative hover:text-white flex items-center"
            >
              <Bookmark size={20} />

              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative hover:text-white flex items-center">
              <ShoppingCart size={20} />

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-[#121216] z-[60] flex flex-col p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-[20px] font-bold">Search</h2>

            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-[#AEAEAF] hover:text-white"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex items-center bg-[#202024] rounded-full px-4 py-3 h-[50px]">
            <Search className="text-[#AEAEAF] mr-3" size={20} />

            <input
              autoFocus
              type="text"
              placeholder="Search store"
              className="bg-transparent text-white outline-none w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;