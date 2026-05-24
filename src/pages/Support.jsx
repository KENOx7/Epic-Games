import { ArrowRight } from "lucide-react";
import supportBg from "../assets/support_bg.jpg";
import { useLanguageStore } from "../store/useLanguageStore";

function Support() {
  const { t } = useLanguageStore()

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${supportBg})` }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 flex justify-end px-5 pt-5">
        <div className="bg-[#1a1a1e]/40 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2">
          <span className="text-gray-300">{t("serverStatus")}</span>
          <span className="text-green-400">{t("systemsOperational")}</span>
        </div>
      </div>
      <div className="relative z-10 flex-1 max-w-[900px] w-full mx-auto px-4 pb-24 flex flex-col items-center justify-center text-center">
        <p className="text-gray-300 text-3xl mb-4">{t("supportTitle")}</p>
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">{t("howCanWeHelp")}</h1>
        <form className="w-full max-w-[580px]">
          <div className="flex items-center border border-gray-400 rounded-full px-5 py-3 bg-black/20">
            <input type="text" placeholder={t("describeProblem")} className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-400"/>
            <button type="submit" className="ml-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            {t("supportTerms1")}
            <span className="text-white underline">{t("supportTermsLink1")}</span>
            {t("supportTerms2")}
            <span className="text-white underline">{t("supportTermsLink2")}</span>
            {t("supportTerms3")}
          </p>
        </div>
      </div>
    </div>
  )
}
export default Support