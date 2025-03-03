import { Button } from "@/components/Button";
import useUserContext from "@/context/UserContext";

export default function HomePage() {
  const { user } = useUserContext()

  return (
    <div className="h-[2000px]">
      <Button>Home page</Button>
      {user && <h1>{user.id}</h1>}
      {user && <h1>{user.firstName}</h1>}
    </div>
  )
}
