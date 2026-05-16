import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import supportBg from "../assets/support_bg.jpg";

function Support() {
  const [query, setQuery] = useState("");

  const searchSupport = (e) => {
    e.preventDefault();

    if (query.trim()) {
      alert(`Searching for: ${query}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supportBg})`,
      }}
    >
      <div className="flex justify-end px-5 pt-5">
        <div className="bg-[#1a1a1e]/40 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2">
          <span className="text-gray-300">Server status:</span>
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span className="text-green-400">All systems operational</span>
        </div>
      </div>

      <div className="flex-1 max-w-[900px] w-full mx-auto px-4 pb-24 flex flex-col items-center justify-center text-center">
        <p className="text-gray-300 text-sm mb-3">Epic Games Support</p>

        <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
          How can we help?
        </h1>

        <form onSubmit={searchSupport} className="w-full max-w-[580px]">
          <div className="flex items-center border border-gray-400 rounded-full px-5 py-3 bg-black/20">
            <input
              type="text"
              placeholder="Describe your problem here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="ml-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Support;