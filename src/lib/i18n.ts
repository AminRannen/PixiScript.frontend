import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Detect language from browser/localStorage
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    fallbackLng: 'en', // Default language
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          createUser: "Create User",
          fullName: "Full Name",
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          password: "Password",
          home: "Home",
          myScripts: "My Scripts",
          newScript: "New Script",
          users: "Users",
          dashboard: "Dashboard",
          profile: "Profile",
          logout: "Logout",
          login : "Login",
          signIn: "Sign In",
          signUp: "Sign Up",
          appName: "PixiScript",
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          createUser: "Créer un utilisateur",
          fullName: "Nom complet",
          firstName: "Prénom",
          lastName: "Nom de famille",
          email: "Email",
          password: "Mot de passe",
          home: "Accueil",
          myScripts: "Mes Scripts",
          newScript: "Nouveau Script",
          users: "Utilisateurs",
          dashboard: "Tableau de bord",
          profile: "Profil",
          logout: "Se déconnecter",
          appName: "PixiScript",
          login : "Connexion",
          signIn: "Se connecter",
          signUp: "S'inscrire",

        },
      },
    },
  });

export default i18n;
