import { getNavLinks } from "@/router/pagesConfig";
import NavLink from './navLink';
import { Button } from "../Button";
import BurgerMenu from "@/assets/icons/burger.svg?react";
import { useState } from "react";
import classNames from "classnames";

export default function MobileNavigation() {
  const [isNavOpen, setNavOpen] = useState(false);

  const navLinks = getNavLinks().map(
    ({ path, pageIconUrl, linkText }) => (
      <NavLink
        key={path}
        isExpanded={true}
        pageIconUrl={pageIconUrl}
        link={path}
        pageName={linkText}
      />
    )
  );

  const handleClick = () => {
    setNavOpen(!isNavOpen);
  };

  // Define the classes for the nav menu with Tailwind
  const navMenuClasses = classNames(
    "p-4 bg-stoneDark flex flex-col transition-all duration-300 ease-in-out z-10",
    {
      "max-h-screen opacity-100 translate-y-0": isNavOpen,
      "max-h-0 opacity-0 -translate-y-5 overflow-hidden": !isNavOpen,
    }
  );

  return (
    <div className="md:hidden fixed top-0 w-full">
      <div className="p-4 bg-stoneDark drop-shadow-md flex justify-between items-center z-20">
        <Button variant="outline" size="icon" onClick={handleClick}>
          <BurgerMenu />
        </Button>
      </div>
      <nav className={navMenuClasses}>
        {navLinks}
      </nav>
    </div>
  );
}

