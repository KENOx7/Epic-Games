import { create } from 'zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // Epoçt ve sifre ile qeydiyyat
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

  // Epoct ve sifre ile giris 
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

  // Google ile giris
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

  initializeAuthListener: () => {
    onAuthStateChanged(auth, (user) => set({ user, loading: false }))
  }
}))