import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";
import { Input } from "./Input";
import { trpc } from "@/trpc";

type SearchParameter = "author" | "title" | "isbn";

export default function BookSearch() {
  const [searchParameter, setSearchParameter] = useState<SearchParameter>("author")
  const [inputValue, setInputValue] = useState("");

  const changeToggleValue = (value: SearchParameter) => {
    setSearchParameter(value)
  }

  const changeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    
  };

  const getBooks = async () => {

    const queryInput =
    searchParameter === "author"
      ? { author: inputValue }
      : searchParameter === "title"
      ? { title: inputValue }
      : { isbn: inputValue }
  
    const books = await trpc.book.fetchBooksFromAPI.query(queryInput)

    return books
  }

  return (
    <div className="flex flex-row">
      <ToggleGroup type="single" onValueChange={changeToggleValue} value={searchParameter}>
        <ToggleGroupItem value="author">Author</ToggleGroupItem>
        <ToggleGroupItem value="title">Title</ToggleGroupItem>
        <ToggleGroupItem value="isbn">ISBN</ToggleGroupItem>
      </ToggleGroup>
      <Input type="text" placeholder={searchParameter} onChange={changeSearchValue} value={inputValue}></Input>
      <h3>{(async () => getBooks)()}</h3>
    </div>
  )
}
