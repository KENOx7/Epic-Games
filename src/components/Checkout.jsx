import React, { useEffect, useState } from "react";
import { X, CreditCard, Wallet, Plus } from "lucide-react";
import logo from "../assets/logo.png";

function getCoverUrl(item, basePath) {
  const folder = item.cartBasePath || basePath;
  const cover = item.saved_images?.find((img) => {
    return img === "cover.jpg" || img === "cover.png";
  });

  return `${folder}/${cover || "cover.jpg"}`;
}

function getPrice(price) {
  if (!price || price === "Free") {
    return 0;
  }

  return Number(price.replace("$", "")) || 0;
}

export default function Checkout({
  game,
  basePath,
  onClose,
  onSuccess,
  cartItems,
}) {
  const [selectedPayment, setSelectedPayment] = useState("credit");

  const items = cartItems || [game];
  const rewards = (getPrice(game.newPrice) * 0.05).toFixed(2);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const payNow = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121214] md:bg-black/70 md:p-4 md:flex md:items-center md:justify-center">
      <div className="bg-[#121214] w-full h-screen md:max-w-[900px] md:h-[90vh] md:rounded-lg flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        <button
          onClick={onClose}
          className="fixed md:absolute right-4 top-4 text-gray-400 hover:text-white z-20"
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-[35%] bg-[#1a1a1e] p-5 md:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Epic Games" className="h-9 object-contain" />
            <span className="font-bold text-white text-xl">Checkout</span>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-16 h-20 bg-[#111] rounded shrink-0 overflow-hidden">
                  <img
                    src={getCoverUrl(item, basePath)}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-xs mt-1">
                    {item.publisher || "Epic Games Store"}
                  </p>

                  {cartItems && (
                    <p className="text-gray-300 text-xs mt-1">
                      {item.newPrice || "Free"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Subtotal</span>
              <span className="text-white text-sm">{game.oldPrice}</span>
            </div>

            {game.discount && (
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400">Discount</span>
                <span className="text-gray-400">{game.discount}</span>
              </div>
            )}

            <div className="border-t border-[#3a3a40] my-4"></div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold text-lg">Total</span>
              <span className="text-white font-bold text-lg">
                {game.newPrice}
              </span>
            </div>

            <div className="bg-[#1e2320] text-[#42b781] px-3 py-2 rounded text-xs">
              Get 5% in Epic Rewards. ${rewards}
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 md:p-8 bg-[#121214] flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Payment Details</h2>

          <div className="flex flex-col gap-3 mb-6">
            <div className="border border-gray-700 rounded-lg p-4 bg-[#1a1a1e] hover:bg-[#202024] cursor-pointer">
              <div className="flex items-center gap-3">
                <Wallet className="text-[#26BBFF]" size={24} />
                <span className="text-white font-medium flex-1">
                  Account Balance
                </span>
              </div>

              <p className="text-gray-400 text-xs mt-2 md:ml-9">
                Use your account balance to buy games, V-Bucks, and in-game
                items. Your account balance is tied to this account.
              </p>

              <div className="mt-3 md:ml-9 flex items-center gap-4">
                <button className="bg-[#2a2a30] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#3a3a40]">
                  Add funds
                </button>

                <span className="text-gray-400 text-xs underline hover:text-white">
                  Learn more
                </span>
              </div>
            </div>

            <div
              onClick={() => setSelectedPayment("credit")}
              className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${selectedPayment === "credit"
                  ? "border-[#26BBFF] bg-[#2a2a30]"
                  : "border-gray-700 hover:bg-[#1a1a1e]"
                }`}
            >
              <div className="w-10 h-8 bg-white rounded flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-[#444]" />
              </div>

              <span className="text-gray-300 font-medium flex-1">
                Credit Card / Debit Card
              </span>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment === "credit"
                    ? "border-[#26BBFF]"
                    : "border-gray-500"
                  }`}
              >
                {selectedPayment === "credit" && (
                  <div className="w-3 h-3 rounded-full bg-[#26BBFF]"></div>
                )}
              </div>
            </div>

            <div
              onClick={() => setSelectedPayment("paypal")}
              className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${selectedPayment === "paypal"
                  ? "border-[#26BBFF] bg-[#2a2a30]"
                  : "border-gray-700 hover:bg-[#1a1a1e]"
                }`}
            >
              <div className="w-10 h-8 flex items-center justify-center shrink-0">
                <img
                  src="https://static-assets-prod.epicgames.com/payment-web/static/pm_icons/paypal-40x26-fb9398e4e292.svg"
                  alt="paypal"
                  className="rounded-sm"
                />
              </div>

              <span className="text-gray-300 font-medium flex-1">PayPal</span>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment === "paypal"
                    ? "border-[#26BBFF]"
                    : "border-gray-500"
                  }`}
              >
                {selectedPayment === "paypal" && (
                  <div className="w-3 h-3 rounded-full bg-[#26BBFF]"></div>
                )}
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 w-fit">
            <Plus size={16} />
            Creator Code
          </button>

          <button
            onClick={payNow}
            className="w-full py-4 rounded-lg font-bold mb-4 bg-[#26BBFF] text-black hover:bg-[#72D3FF]"
          >
            Pay Now
          </button>

          <p className="text-[11px] text-gray-500 leading-relaxed pb-6 md:pb-0">
            By selecting "Pay Now", you certify that you are over 18, are
            authorized to use this payment method, and agree to the{" "}
            <span className="text-[#26BBFF] hover:underline cursor-pointer">
              End User License Agreement
            </span>
            .
            <br />
            <br />
            You are paying for a digital license for this product; for terms,
            see{" "}
            <span className="text-[#26BBFF] hover:underline cursor-pointer">
              purchase policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}