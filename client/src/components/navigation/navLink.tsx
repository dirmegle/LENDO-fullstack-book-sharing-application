import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface NavLinkProps {
  link: string;
  pageName: string;
  pageIconUrl: string;
  isExpanded: boolean;
}

export default function NavLinkComponent({
  link,
  pageName,
  pageIconUrl,
  isExpanded,
}: NavLinkProps) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md mb-3 p-2 text-primary text-md hover:bg-muted-green transition-all duration-100 ease-in-out",
          isActive && "outline outline-input bg-accent-green"
        )
      }
    >
        <div className="w-[25px]"><img src={pageIconUrl} alt={pageName} /></div>
      <span className={cn(!isExpanded && "hidden")}>{pageName}</span>
    </NavLink>
  );
}

