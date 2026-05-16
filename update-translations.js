const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'translations.json');
const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const additions = {
  "en": {
    "logOut": "Sign Out",
    "signUp": "Sign Up",
    "emailAddress": "Email Address",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "or": "or",
    "signInWithGoogle": "Sign in with Google",
    "signUpWithGoogle": "Sign up with Google",
    "dontHaveAccount": "Don't have an Epic Games account?",
    "alreadyHaveAccount": "Already have an account?"
  },
  "tr": {
    "logOut": "Çıkış Yap",
    "signUp": "Kayıt Ol",
    "emailAddress": "E-posta Adresi",
    "password": "Şifre",
    "confirmPassword": "Şifreyi Onayla",
    "or": "veya",
    "signInWithGoogle": "Google ile Giriş Yap",
    "signUpWithGoogle": "Google ile Kayıt Ol",
    "dontHaveAccount": "Epic Games hesabınız yok mu?",
    "alreadyHaveAccount": "Zaten bir hesabınız var mı?"
  },
  "ru": {
    "logOut": "Выйти",
    "signUp": "Зарегистрироваться",
    "emailAddress": "Адрес электронной почты",
    "password": "Пароль",
    "confirmPassword": "Подтвердите пароль",
    "or": "или",
    "signInWithGoogle": "Войти через Google",
    "signUpWithGoogle": "Зарегистрироваться через Google",
    "dontHaveAccount": "Нет аккаунта Epic Games?",
    "alreadyHaveAccount": "Уже есть аккаунт?"
  },
  "az": {
    "logOut": "Çıxış et",
    "signUp": "Qeydiyyatdan keç",
    "emailAddress": "E-poçt ünvanı",
    "password": "Şifrə",
    "confirmPassword": "Şifrəni təsdiqlə",
    "or": "və ya",
    "signInWithGoogle": "Google ilə daxil ol",
    "signUpWithGoogle": "Google ilə qeydiyyatdan keç",
    "dontHaveAccount": "Epic Games hesabınız yoxdur?",
    "alreadyHaveAccount": "Artıq hesabınız var?"
  }
};

for (const lang of Object.keys(translations)) {
  if (additions[lang]) {
    Object.assign(translations[lang], additions[lang]);
  }
}

fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Translations updated successfully.');
