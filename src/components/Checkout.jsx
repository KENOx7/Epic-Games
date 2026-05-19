import { useEffect, useState } from "react";
import { X, CreditCard, Wallet, Plus } from "lucide-react";
import logo from "../assets/logo.png";
import { useLanguageStore } from "../store/useLanguageStore";

function getCoverUrl(item) {
  const folder = item.cartBasePath
  const isPng = item.saved_images?.includes("cover.png")
  return `${folder}/${isPng ? "cover.png" : "cover.jpg"}`
}

function getPrice(price) {
  if (!price || price === "Free") return 0
  return Number(price.replace("$", ""))
}

function Checkout({ game, basePath, onClose, onSuccess, cartItems }) {
  const { t } = useLanguageStore();

  // Seçilmiş payment metodunu saxlayır
  const [payment, setPayment] = useState("credit");

  // Əgər cartItems varsa səbətdəki oyunları göstərir, yoxdursa tək oyun göstərir
  const items = cartItems || [game];

  // Epic Rewards üçün 5% hesablayır
  const rewards = (getPrice(game.newPrice) * 0.05).toFixed(2);

  useEffect(() => {
    // Checkout açıq olanda arxadakı səhifə scroll olmasın
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);



  return (
    <div className="fixed inset-0 z-[70] bg-[#121214] md:bg-black/70 md:p-4 md:flex md:items-center md:justify-center">
      <div className="bg-[#121214] w-full h-screen md:max-w-[900px] md:h-[90vh] md:rounded-lg flex flex-col md:flex-row overflow-y-auto relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 z-20">
          <X size={24} />
        </button>
        {/* Sol hissə: oyun məlumatı və qiymət */}
        <div className="w-full md:w-[35%] bg-[#1a1a1e] p-5 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Epic Games" className="h-9 object-contain" />
            <span className="font-bold text-white text-xl">{t("checkoutTitle")}</span>
          </div>
          {/* Alınacaq oyunların listi */}
          <div className="space-y-4 mb-6 max-h-[430px] overflow-y-auto pr-2 hide-scrollbar">
            {items.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-16 h-20 bg-[#111] rounded">
                  <img src={getCoverUrl(item, basePath)} alt={item.title} className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-sm font-medium">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.publisher}</p>
                  <p className="text-gray-300 text-xs mt-1">{item.newPrice}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Qiymət hesablamaları */}
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">{t("subtotal")}</span>
            <span className="text-white text-sm">{game.oldPrice}</span>
          </div>
          {game.discount && (
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-400">{t("discountText")}</span>
              <span className="text-gray-400">{game.discount}</span>
            </div>
          )}
          <div className="border-t border-[#3a3a40] my-4"></div>
          <div className="flex justify-between mb-4">
            <span className="text-white font-bold text-lg">{t("total")}</span>
            <span className="text-white font-bold text-lg">{game.newPrice}</span>
          </div>
          <div className="bg-[#1e2320] text-[#42b781] px-3 py-2 rounded text-xs">
            {t("getEpicRewards")} ${rewards}
          </div>
        </div>
        {/* Sağ hissə: payment metodları */}
        <div className="flex-1 p-5 md:p-8 bg-[#121214]">
          <h2 className="text-xl font-bold text-white mb-6">{t("paymentDetails")}</h2>
          <div className="flex flex-col gap-3 mb-6">
            <div className="border border-gray-700 rounded-lg p-4 bg-[#1a1a1e]">
              <div className="flex items-center gap-3">
                <Wallet className="text-[#26BBFF]" size={24} />
                <span className="text-white font-medium">{t("accountBalance")}</span>
              </div>
              <p className="text-gray-400 text-xs mt-2 md:ml-9">{t("accountBalanceDesc")}</p>
              <div className="mt-3 md:ml-9 flex items-center gap-4">
                <button className="bg-[#2a2a30] text-white px-3 py-2 rounded text-xs font-bold">
                  {t("addFunds")}
                </button>
                <span className="text-gray-400 text-xs underline">{t("learnMore")}</span>
              </div>
            </div>
            {/* Credit card seçimi */}
            <div
              onClick={() => setPayment("credit")}
              className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer 
                ${payment == "credit" ? "border-[#26BBFF] bg-[#2a2a30]" : "border-gray-700"}`}>
              <div className="w-10 h-8 bg-white rounded flex items-center justify-center">
                <CreditCard size={18} className="text-[#444]" />
              </div>
              <span className="text-gray-300 font-medium flex-1">{t("creditDebitCard")}</span>
              <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                {payment == "credit" && <div className="w-3 h-3 rounded-full bg-[#26BBFF]" />}
              </div>
            </div>
            {/* PayPal seçimi */}
            <div
              onClick={() => setPayment("paypal")}
              className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer
                ${payment == "paypal" ? "border-[#26BBFF] bg-[#2a2a30]" : "border-gray-700"}`}>
              <div className="w-10 h-8 flex items-center justify-center">
                <img src="https://static-assets-prod.epicgames.com/payment-web/static/pm_icons/paypal-40x26-fb9398e4e292.svg" alt="PayPal" className="rounded-sm"/>
              </div>
              <span className="text-gray-300 font-medium flex-1">PayPal</span>
              <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                {payment == "paypal" && <div className="w-3 h-3 rounded-full bg-[#26BBFF]" />}
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6">
            <Plus size={16} />
            {t("creatorCode")}
          </button>
          <button onClick={onSuccess || onClose} className="w-full py-4 rounded-lg font-bold mb-4 bg-[#26BBFF] text-black">
            {t("payNow")}
          </button>
          <p className="text-[12px] text-gray-500 pb-6 md:pb-0">{t("payNowDisclaimer1")}
            <span className="text-[#26BBFF]">{t("eula")}</span>. <br /> <br />
            {t("payNowDisclaimer2")} <span className="text-[#26BBFF]">{t("purchasePolicy")}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;