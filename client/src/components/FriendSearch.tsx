import { User } from "@server/shared/types";
import { Input } from "./Input";
import { useRef, useState } from "react";
import { trpc } from "@/trpc";
import Loader from "./Loader/Loader";
import FriendProfile from "./FriendProfile";
import { Separator } from "./Separator";
import { Button } from "./Button";

export default function FriendSearch() {
    const [searchValue, setSearchValue] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>) => {
        let inputValue: string

    if ('clipboardData' in e) {
      inputValue = e.clipboardData.getData('text')
    } else {
      inputValue = e.target.value
    }

    setSearchValue(inputValue)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }


    if (inputValue === '') {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const users = await trpc.user.getUsersByName.query({name: searchValue})
        setResults(users)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }, 500)
    }

  return (
      <div>
        <h2 className="font-medium my-2">Find users:</h2>
        <div>
          <Input placeholder='Search user name' value={searchValue} onChange={handleInputChange} className="mb-4"/>
          {searchValue !== '' && (isLoading || results.length > 0) && (
            <div>
                {isLoading && <Loader />}
                <div className="flex flex-col gap-2">
                {results.length > 0 && results.map((user) => (
                    <div className="border border-border p-2"> <><FriendProfile {...user}/><Button>Send invite</Button></> </div>
                ))}
                </div>
                <Separator className="my-4" />
            </div>
          )}
        </div>
      </div>
  )
}
