import { useState, useEffect, ReactElement } from "react";
import { auth } from "../../services/firebase";
import { setPersistence,   browserSessionPersistence } from "firebase/auth";
import Loading from "../ui/Loading";


export default function AuthProvider({ children }: { children: ReactElement }) {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
     await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return <div>{
    isLoading
    ? <Loading/> 
    
    :children

  }</div>;
}
