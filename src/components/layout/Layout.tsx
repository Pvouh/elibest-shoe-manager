
import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-light border-t border-borderColor py-4">
        <div className="container mx-auto px-4 text-center text-sm text-text/60">
          © {new Date().getFullYear()} Elibest Shoe Management System
        </div>
      </footer>
    </div>
  );
};

export default Layout;
