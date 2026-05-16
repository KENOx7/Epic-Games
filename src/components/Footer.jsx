import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronDown } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import logo from "../assets/logo.png";

export default function Footer() {
  const [open, setOpen] = useState("");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleSection = (name) => {
    if (open == name) {
      setOpen("");
    } else {
      setOpen(name);
    }
  };

  return (
    <footer className="bg-[#121216] pt-10 pb-8 px-4 w-full">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center md:flex-row md:justify-between mb-8 gap-6">
          <Link to="/">
            <img src={logo} alt="Epic Games Store" className="h-8" />
          </Link>
          <div className="flex items-center gap-5 text-gray-400">
            <a href="https://www.linkedin.com/in/kanan-akhmadov-774647291" className="hover:text-white">
              <FaFacebookF size={20} />
            </a>

            <a href="https://www.linkedin.com/in/kanan-akhmadov-774647291" className="hover:text-white">
              <FaXTwitter size={20} />
            </a>

            <a href="https://www.linkedin.com/in/kanan-akhmadov-774647291" className="hover:text-white">
              <FaYoutube size={22} />
            </a>
          </div>
        </div>

        <div className="md:hidden border-t border-[#2a2a2a]">
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("games")}
              className="w-full flex items-center justify-between py-4 text-white font-bold"
            >
              Games
              <ChevronDown size={18} />
            </button>

            {open === "games" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">Fortnite</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Fall Guys</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Rocket League</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Unreal Tournament</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Infinity Blade</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Shadow Complex</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Robo Recall</a></li>
              </ul>
            )}
          </div>

          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("marketplaces")}
              className="w-full flex items-center justify-between py-4 text-white font-bold"
            >
              Marketplaces
              <ChevronDown size={18} />
            </button>

            {open === "marketplaces" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">Epic Games Store</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Fab</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Quixel Megascans on Fab</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Quixel Megaplants on Fab</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Sketchfab</a></li>
                <li><a href="#" className="text-gray-400 text-sm">ArtStation</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Store Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Store EULA</a></li>
              </ul>
            )}
          </div>

          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("tools")}
              className="w-full flex items-center justify-between py-4 text-white font-bold"
            >
              Tools
              <ChevronDown size={18} />
            </button>

            {open === "tools" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">Unreal Engine</a></li>
                <li><a href="#" className="text-gray-400 text-sm">UEFN</a></li>
                <li><a href="#" className="text-gray-400 text-sm">MetaHuman</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Twinmotion</a></li>
                <li><a href="#" className="text-gray-400 text-sm">RealityScan</a></li>
                <li><a href="#" className="text-gray-400 text-sm">RAD Game Tools</a></li>
              </ul>
            )}
          </div>

          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("online")}
              className="w-full flex items-center justify-between py-4 text-white font-bold"
            >
              Online Services
              <ChevronDown size={18} />
            </button>

            {open === "online" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">Epic Online Services</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Kids Web Services</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Services Agreement</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Acceptable Use Policy</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Trust Statement</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Subprocessor List</a></li>
              </ul>
            )}
          </div>

          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between py-4 text-white font-bold"
            >
              Company
              <ChevronDown size={18} />
            </button>

            {open === "company" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Newsroom</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Students</a></li>
                <li><a href="#" className="text-gray-400 text-sm">UX Research</a></li>
              </ul>
            )}
          </div>

          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("resources")}
              className="w-full flex items-center justify-between py-4 text-white font-bold"
            >
              Resources
              <ChevronDown size={18} />
            </button>

            {open === "resources" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">Dev Community</a></li>
                <li><a href="#" className="text-gray-400 text-sm">MegaGrants</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Support-A-Creator</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Creator Agreement</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Distribute on Epic Games</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Unreal Engine Branding Guidelines</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Fan Art Policy</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Community Rules</a></li>
                <li><a href="#" className="text-gray-400 text-sm">EU Digital Services Act Inquiries</a></li>
                <li><a href="#" className="text-gray-400 text-sm">Epic Pro Support</a></li>
              </ul>
            )}
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 border-t border-[#3a3a40] pt-8">
          <div>
            <h3 className="text-white font-bold mb-4">Games</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Fortnite</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Fall Guys</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Rocket League</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Unreal Tournament</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Infinity Blade</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Shadow Complex</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Robo Recall</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Marketplaces</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Epic Games Store</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Fab</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Quixel Megascans on Fab</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Quixel Megaplants on Fab</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Sketchfab</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">ArtStation</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Store Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Store EULA</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Tools</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Unreal Engine</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">UEFN</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">MetaHuman</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Twinmotion</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">RealityScan</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">RAD Game Tools</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Online Services</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Epic Online Services</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Kids Web Services</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Services Agreement</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Acceptable Use Policy</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Trust Statement</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Subprocessor List</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Newsroom</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Students</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">UX Research</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Dev Community</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">MegaGrants</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Support-A-Creator</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Creator Agreement</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Distribute on Epic Games</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Unreal Engine Branding Guidelines</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Fan Art Policy</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Community Rules</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">EU Digital Services Act Inquiries</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Epic Pro Support</a></li>
            </ul>
          </div>
        </div>

        <div className="md:border-t md:border-[#3a3a40] md:pt-8 mt-8 md:mt-0">
          <p className="text-[#AEAEAF] text-[11px] md:text-xs leading-relaxed text-center md:text-left max-w-[850px] mx-auto md:mx-0">
            © 2026 Epic Games, Inc. All rights reserved. Epic, Epic Games, the
            Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine,
            the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament
            logo are trademarks or registered trademarks of Epic Games, Inc. in
            the United States of America and elsewhere. Other brands or product
            names are the trademarks of their respective owners. Our websites
            may contain links to other sites and resources provided by third
            parties. These links are provided for your convenience only. Epic
            Games has no control over the contents of those sites or resources,
            and accepts no responsibility for them or for any loss or damage
            that may arise from your use of them.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 mt-8">
            <a href="#" className="text-gray-400 text-xs hover:text-white">
              Terms of service
            </a>

            <a href="#" className="text-gray-400 text-xs hover:text-white">
              Privacy policy
            </a>

            <a href="#" className="text-gray-400 text-xs hover:text-white">
              Safety & security
            </a>

            <a href="#" className="text-gray-400 text-xs hover:text-white">
              Store refund policy
            </a>

            <a href="#" className="text-gray-400 text-xs hover:text-white">
              Publisher Index
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end mt-8">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white bg-[#353539] hover:bg-[#45454a] px-4 py-2 rounded-md text-sm"
          >
            Back to top
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}