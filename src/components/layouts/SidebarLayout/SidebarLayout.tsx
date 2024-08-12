import { ReactElement } from "react";
import LayoutHeader from "./LayoutHeader";
import Sidebar from "./Sidebar";
export default function SidebarLayout({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <div className="fit-center">
      <section className="layout-grid w-full relative">
        {/* header */}
        <LayoutHeader />
        {/* sidebar */}
        <Sidebar />
        {/*main */}
        <section className="h-full   grid-main  ">
          {children}
        </section>
      </section>
    </div>
  );
}
