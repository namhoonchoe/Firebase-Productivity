// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  AuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { redirect } from "react-router-dom";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const signUp = async (
  email: string,
  password: string,
  userName: string
) => {
  try {
    const credentials = createUserWithEmailAndPassword(auth, email, password);
    await updateProfile((await credentials).user, {
      displayName: userName,
    });
    redirect("/");
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e.message);
    }
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    redirect("/");
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e.message);
    }
  }
};

export const socialLogin = async (provider: AuthProvider) => {
  try {
    await signInWithPopup(auth, provider);
    redirect("/");
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e.message);
    }
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    redirect("/auth/signin");
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e.message);
    }
  }
};
