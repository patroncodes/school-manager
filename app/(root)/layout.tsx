import { ReactNode } from "react";
import MenuSidebar from "@/components/landing-page/MenuSidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full">
      <MenuSidebar />
      {children}
    </div>
  );
};
export default Layout;
