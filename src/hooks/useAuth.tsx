import { FirebaseError } from "firebase/app";
import {
  AuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebase";
export default function useAuth() {
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, userName: string) => {
    try {
      const credentials = createUserWithEmailAndPassword(auth, email, password);
      await updateProfile((await credentials).user, {
        displayName: userName,
      });
      navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const socialLogin = async (provider: AuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth/signin")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };
  return {
    signUp,
    signIn,
    socialLogin,
    handleSignOut,
  };
}
