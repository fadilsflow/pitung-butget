"use client"

import { TransactionType } from "@/lib/types"
import { useCallback, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Category } from "@prisma/client"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CommandInput, CommandList, CommandItem, Command, CommandEmpty, CommandGroup } from "@/components/ui/command"
import CreateCategoryDialog from "./CreateCategoryDialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryPickerProps {
    type: TransactionType
    onSuccesCallback: (category: Category) => void
}

function CategoryPicker({ type, onSuccesCallback }: CategoryPickerProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")

    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then(res => res.json())
    })

    const selectedCategory = categoriesQuery.data?.find(
        (category: Category) => category.name === value
    )
    const succesCallback = useCallback((category: Category) => {
        setValue(category.name)
        setOpen(prev => !prev)
        onSuccesCallback(category)
    }, [setValue, setOpen, onSuccesCallback])

    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select a category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search category" />
                    <CreateCategoryDialog type={type} onSuccesCallback={succesCallback}/>
                    <CommandEmpty>
                        <p className="text-xs text-muted-foreground">Categories not found.</p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {categoriesQuery.data?.map((category: Category) => (
                                <CommandItem
                                    key={category.name}
                                    onSelect={() => {
                                        setValue(category.name)
                                        setOpen(false)
                                    }}
                                >
                                    <CategoryRow category={category} />
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4 opacity-0",
                                            value === category.name && "opacity-100"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function CategoryRow({ category }: { category: Category }) {
    return (
        <div className="flex items-center gap-2">
            <span role="img">{category.icon}</span>
            <span>{category.name}</span>
        </div>
    )
}

export default CategoryPicker