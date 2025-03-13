import BookSearch from "./BookSearch";
import Logo from "./Logo";

export default function Header() {
  return (
    <div className="flex flex-row justify-between">
      <BookSearch />
      <Logo />
    </div>
  )
}
