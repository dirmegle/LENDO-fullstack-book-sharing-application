import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DesktopNavigation from "@/components/Navigation/DesktopNavigation";
import MobileNavigation from "@/components/Navigation/MobileNavigation";
import { Toaster } from "@/components/Toast/Toaster";
import { Outlet } from "react-router-dom";

export default function AuthPageLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[min-content_auto] md:mt-0 mt-12 min-h-screen 3xl:max-w-[60%] mx-auto">
        <MobileNavigation />
        <DesktopNavigation />
      <div className="flex flex-col h-full w-full py-4 px-8 gap-7">
        <header className="md:mt-0 mt-10">
          <Header />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer>
          <Footer />
          <Toaster />
        </footer>
      </div>
    </div>
  );
}
