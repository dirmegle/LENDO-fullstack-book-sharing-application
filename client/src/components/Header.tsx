import BookSearch from "./BookSearch";
import Logo from "./Logo";

export default function Header() {
  return (
    <div className="flex flex-row md:justify-between">
      <BookSearch />
      <div className="md:block hidden">
      <Logo />
      </div>
    </div>
  )
}
