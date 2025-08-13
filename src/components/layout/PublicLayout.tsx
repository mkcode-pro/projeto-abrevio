import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-grow pt-14 sm:pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}