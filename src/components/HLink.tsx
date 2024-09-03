import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function HLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  return (
    <Link to={to} state={{ prevPath: location.pathname }} className="w-full">
      {children}
    </Link>
  );
}
