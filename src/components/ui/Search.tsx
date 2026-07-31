import { useForm } from "@tanstack/react-form"
import { Search as SearchIcon, X } from "lucide-react"
import { Input } from "#/components/ui/input"
import { Button } from "#/components/ui/button"
import type { ReactNode } from "react"

type SearchProps = {
    query: string
    resultCount: ReactNode
    onQueryChange: (value: string) => void
}

const Search = ({ query, resultCount, onQueryChange }: SearchProps) => {
    const form = useForm({
        defaultValues: { q: query },
    })

    return (
        <div className="search-bar">
            <div className="row">
                <form.Field
                    name="q"
                    listeners={{
                        onChangeDebounceMs: 400,
                        onChange: ({ value }) => onQueryChange(value),
                    }}
                >
                    {(field) => (
                        <div className="field">
                            <SearchIcon size={16} className="icon" />
                            <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Search title or description"
                                className="search-input"
                            />
                            {field.state.value && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="search-clear"
                                    onClick={() => {
                                        field.handleChange("")
                                    }}
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </Button>
                            )}
                        </div>
                    )}
                </form.Field>
            </div>

            <p className="status">
                {resultCount}
            </p>
        </div>
    )
}

export default Search
