import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronDown } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import store from "../assets/store.svg";
import { useLanguageStore } from "../store/useLanguageStore";

export default function Footer() {
  const [open, setOpen] = useState("")
  const { t } = useLanguageStore()
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const toggleSection = (name) => {
    if (open == name) setOpen("")
    else setOpen(name)
  }

  return (
    <footer className="bg-[#121216] pt-10 pb-8 px-4 w-full">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center md:flex-row md:justify-between mb-8 gap-6">
          <Link to="/"><img src={store} alt="Epic Games Store"/></Link>
          <div className="flex items-center gap-5 text-gray-400">
            <a href="https://www.linkedin.com/in/kanan-akhmadov-774647291" className="hover:text-white"><FaFacebookF size={20} /></a>
            <a href="https://www.linkedin.com/in/kanan-akhmadov-774647291" className="hover:text-white"><FaXTwitter size={20} /></a>
            <a href="https://www.linkedin.com/in/kanan-akhmadov-774647291" className="hover:text-white"><FaYoutube size={22} /></a>
          </div>
        </div>
        <div className="md:hidden border-t border-[#2a2a2a]">
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("games")}
              className="w-full flex items-center justify-between py-4 text-white font-bold">
              {t("games")}
              <ChevronDown size={18} className={`transition-transform duration-200 ${open == "games" ? "rotate-180" : ""}`} />
            </button>
            {open == "games" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">{t("fortnite")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("fallGuys")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("rocketLeague")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("unrealTournament")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("infinityBlade")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("shadowComplex")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("roboRecall")}</a></li>
              </ul>
            )}
          </div>
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("marketplaces")}
              className="w-full flex items-center justify-between py-4 text-white font-bold">
              {t("marketplaces")}
              <ChevronDown size={18} className={`transition-transform duration-200 ${open == "marketplaces" ? "rotate-180" : ""}`} />
            </button>
            {open == "marketplaces" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">{t("epicGamesStore")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("fab")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("quixelMegascans")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("quixelMegaplants")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("sketchfab")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("artStation")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("storeRefundPolicy")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("storeEula")}</a></li>
              </ul>
            )}
          </div>
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("tools")}
              className="w-full flex items-center justify-between py-4 text-white font-bold">
              {t("tools")}
              <ChevronDown size={18} className={`transition-transform duration-200 ${open == "tools" ? "rotate-180" : ""}`} />
            </button>
            {open == "tools" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">{t("unrealEngine")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("uefn")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("metaHuman")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("twinmotion")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("realityScan")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("radGameTools")}</a></li>
              </ul>
            )}
          </div>
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("online")}
              className="w-full flex items-center justify-between py-4 text-white font-bold">
              {t("onlineServices")}
              <ChevronDown size={18} className={`transition-transform duration-200 ${open == "online" ? "rotate-180" : ""}`} />
            </button>
            {open == "online" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">{t("epicOnlineServices")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("kidsWebServices")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("servicesAgreement")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("acceptableUsePolicy")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("trustStatement")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("subprocessorList")}</a></li>
              </ul>
            )}
          </div>
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between py-4 text-white font-bold">
              {t("company")}
              <ChevronDown size={18} className={`transition-transform duration-200 ${open == "company" ? "rotate-180" : ""}`} />
            </button>
            {open == "company" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">{t("about")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("newsroom")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("careers")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("students")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("uxResearch")}</a></li>
              </ul>
            )}
          </div>
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => toggleSection("resources")}
              className="w-full flex items-center justify-between py-4 text-white font-bold">
              {t("resources")}
              <ChevronDown size={18} className={`transition-transform duration-200 ${open == "resources" ? "rotate-180" : ""}`} />
            </button>
            {open == "resources" && (
              <ul className="pb-4 flex flex-col gap-2">
                <li><a href="#" className="text-gray-400 text-sm">{t("devCommunity")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("megaGrants")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("supportACreator")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("creatorAgreement")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("distributeOnEpic")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("unrealBranding")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("fanArtPolicy")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("communityRules")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("euDigitalServices")}</a></li>
                <li><a href="#" className="text-gray-400 text-sm">{t("epicProSupport")}</a></li>
              </ul>
            )}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 border-t border-[#3a3a40] pt-8">
          <div>
            <h3 className="text-white font-bold mb-4">{t("games")}</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("fortnite")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("fallGuys")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("rocketLeague")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("unrealTournament")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("infinityBlade")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("shadowComplex")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("roboRecall")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">{t("marketplaces")}</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("epicGamesStore")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("fab")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("quixelMegascans")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("quixelMegaplants")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("sketchfab")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("artStation")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("storeRefundPolicy")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("storeEula")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">{t("tools")}</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("unrealEngine")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("uefn")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("metaHuman")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("twinmotion")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("realityScan")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("radGameTools")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">{t("onlineServices")}</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("epicOnlineServices")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("kidsWebServices")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("servicesAgreement")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("acceptableUsePolicy")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("trustStatement")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("subprocessorList")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">{t("company")}</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("about")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("newsroom")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("careers")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("students")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("uxResearch")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">{t("resources")}</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("devCommunity")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("megaGrants")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("supportACreator")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("creatorAgreement")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("distributeOnEpic")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("unrealBranding")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("fanArtPolicy")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("communityRules")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("euDigitalServices")}</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">{t("epicProSupport")}</a></li>
            </ul>
          </div>
        </div>
        <div className="md:border-t md:border-[#3a3a40] md:pt-8 mt-8 md:mt-0">
          <p className="text-[#AEAEAF] text-xs md:text-xs leading-relaxed text-center md:text-left max-w-[850px]">
            {t("copyrightText")}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 mt-8">
            <a href="#" className="text-gray-400 text-xs hover:text-white">{t("termsOfService")}</a>
            <a href="#" className="text-gray-400 text-xs hover:text-white">{t("privacyPolicy")}</a>
            <a href="#" className="text-gray-400 text-xs hover:text-white">{t("safetySecurity")}</a>
            <a href="#" className="text-gray-400 text-xs hover:text-white">{t("storeRefundPolicy")}</a>
            <a href="#" className="text-gray-400 text-xs hover:text-white">{t("publisherIndex")}</a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end mt-8">
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white bg-[#353539] hover:bg-[#45454a] px-4 py-2 rounded-md text-sm">
            {t("backToTop")}
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}