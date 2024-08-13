import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

export default function ProtectedRoute({
    children,
  }: {
    children:ReactNode;
  })  {
    const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/auth/signin" />;
  }
  return children;
}
