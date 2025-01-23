import DesktopNavigation from "@/components/navigation/desktopNavigation";
import MobileNavigation from "@/components/navigation/mobileNavigation";
import { Outlet } from "react-router-dom";

export default function authPageLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[min-content_auto] md:mt-0 mt-12 gap-4 min-h-screen 2xl:max-w-[60%] mx-auto">
      <div className="h-full">
        <MobileNavigation />
        <DesktopNavigation />
      </div>
      <div className="h-full  w-full p-4">
        <header>
          Header
        </header>
        <div className="h-full">
        <main>
        <Outlet />
        </main>
        <footer>
          Footer
        </footer>
        </div>
      </div>
    </div>
  )
}
