"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Data dummy untuk testing
const FRUITS = [
  { name: "Apple" },
  { name: "Banana" },
  { name: "Orange" },
  { name: "Grape" },
  { name: "Mango" },
]

export function SimpleCombobox() {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue || "Select fruit..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search fruit..." />
          <CommandList>
            <CommandGroup>
              {FRUITS.map((fruit) => (
                <CommandItem
                  key={fruit.name}
                  value={fruit.name}
                  onSelect={() => {
                    setSelectedValue(fruit.name)
                    setOpen(false)
                  }}
                  className="cursor-pointer aria-selected:bg-accent"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 opacity-0",
                      selectedValue === fruit.name && "opacity-100"
                    )}
                  />
                  {fruit.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}