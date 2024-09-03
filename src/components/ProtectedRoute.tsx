import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";
import SyncBoard from "@/components/SyncBoard";

export default function ProtectedRoute({
    children,
  }: {
    children:ReactNode;
  })  {
    const user = auth.currentUser;
    SyncBoard()
    if (user === null) {
    return <Navigate to="/auth/signin" />;
  }
  
  return children;
}
