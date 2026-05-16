import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn, logInWithGoogle, error, loading } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await logInWithGoogle();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#101014] flex flex-col items-center justify-center p-4">
      <div className="bg-[#202024] p-8 rounded-xl shadow-2xl w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Epic Games" className="h-12" />
        </div>
        
        <h2 className="text-white text-xl font-bold text-center mb-6">
          {t("signIn")}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailAddress")}
              className="w-full bg-[#101014] text-white border border-[#3a3a40] focus:border-[#26bbff] outline-none rounded-md px-4 py-3 text-sm transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              className="w-full bg-[#101014] text-white border border-[#3a3a40] focus:border-[#26bbff] outline-none rounded-md px-4 py-3 text-sm transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#26bbff] hover:bg-[#72d3ff] text-black font-bold py-3 rounded-md transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "..." : t("signIn")}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#3a3a40] absolute w-full"></div>
          <span className="bg-[#202024] px-4 text-[#AEAEAF] text-xs uppercase z-10">{t("or")}</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          {t("signInWithGoogle")}
        </button>

        <p className="text-center text-[#AEAEAF] text-sm mt-8">
          {t("dontHaveAccount")}{" "}
          <Link to="/register" className="text-white underline hover:text-[#26bbff]">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
