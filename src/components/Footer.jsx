import React from "react";
import { ArrowUp } from "lucide-react";
import storeLogo from "../assets/store.svg";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#121216] pt-12 pb-8 px-4 w-full">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <img src={storeLogo} alt="Epic Games Store" className="h-8" />

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-[#26BBFF]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            <a href="#" className="text-gray-400 hover:text-[#26BBFF]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267L8.267 4z" />
                <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
              </svg>
            </a>

            <a href="#" className="text-gray-400 hover:text-[#26BBFF]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#3a3a40] mb-8"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold mb-4">Games</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Fortnite
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Fall Guys
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Rocket League
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Unreal Tournament
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Infinity Blade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Shadow Complex
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Robo Recall
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Marketplaces</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Epic Games Store
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Fab
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Quixel Megascans on Fab
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Quixel Megaplants on Fab
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Sketchfab
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  ArtStation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Store Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Store EULA
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Tools</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Unreal Engine
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  UEFN
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  MetaHuman
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Twinmotion
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  RealityScan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  RAD Game Tools
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Online Services</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Epic Online Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Kids Web Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Services Agreement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Acceptable Use Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Trust Statement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Subprocessor List
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Newsroom
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Students
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  UX Research
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Dev Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  MegaGrants
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Support-A-Creator
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Creator Agreement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Distribute on Epic Games
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Unreal Engine Branding Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Fan Art Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Community Rules
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  EU Digital Services Act Inquiries
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Epic Pro Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#3a3a40] mb-8"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <p className="text-[#AEAEAF] text-xs leading-relaxed max-w-[800px]">
            © 2026 Epic Games, Inc. All rights reserved. Epic, Epic Games, the
            Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine,
            the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament
            logo are trademarks or registered trademarks of Epic Games, Inc. in
            the United States of America and elsewhere. Other brands or product
            names are the trademarks of their respective owners. Our websites
            may contain links to other sites and resources provided by third
            parties.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white bg-[#202024] hover:bg-[#353539] px-4 py-2 rounded-md"
          >
            Back to top
            <ArrowUp size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          <a href="#" className="text-gray-400 text-sm hover:text-white">
            Terms of service
          </a>

          <a href="#" className="text-gray-400 text-sm hover:text-white">
            Privacy policy
          </a>

          <a href="#" className="text-gray-400 text-sm hover:text-white">
            Safety & security
          </a>

          <a href="#" className="text-gray-400 text-sm hover:text-white">
            Store refund policy
          </a>

          <a href="#" className="text-gray-400 text-sm hover:text-white">
            Publisher Index
          </a>
        </div>
      </div>
    </footer>
  );
}