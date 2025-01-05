import { Outlet } from "react-router-dom";

export default function authPageLayout() {
  return (
    <div className="grid grid-cols-[min-content_auto] gap-2 min-h-screen 2xl:max-w-[60%] mx-auto">
      <div className="h-full">Navigation</div>
      <div className="h-full  w-full">
        <header>
          Header
        </header>
        <main className="h-full">
        <Outlet />
        </main>
        <footer>
          Footer
        </footer>
      </div>
    </div>
  )
}
