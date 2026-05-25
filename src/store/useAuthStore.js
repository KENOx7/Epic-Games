import { create } from 'zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // E-poçt və şifrə ilə qeydiyyatdan keçmək
  signUp: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      set({ user: userCredential.user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // E-poçt və şifrə ilə giriş etmək
  logIn: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      set({ user: userCredential.user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Google hesabı ilə giriş etmək
  logInWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      set({ user: userCredential.user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Sistemdən çıxış etmək
  logOut: async () => {
    set({ loading: true, error: null })
    try {
      await signOut(auth)
      set({ user: null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // İstifadəçinin giriş/çıxış vəziyyətini (auth state) daim izləmək
  initializeAuthListener: () => {
    onAuthStateChanged(auth, (user) => set({ user, loading: false }))
  }
}))