"use client"

import * as React from "react"
import { Check, ChevronUp, Funnel } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: FilterProps) {
  const [open, setOpen] = React.useState(false)

  const categoryOptions = [
    { value: "", label: "ALL" },
    ...categories.map(category => ({ value: category, label: category }))
  ]

  const longestCategory = categoryOptions.reduce((longest, option) => {
    if (option.label.length > longest.length) {
      return option.label
    }
    return longest
  }, "")

  const triggerWidth = longestCategory.length * 14;

  console.log(triggerWidth);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{ width: `${triggerWidth}px` }}
        >
          <Funnel className="opacity-50" />
          {categoryOptions.find((option) => option.value === selectedCategory)?.label}
          <ChevronUp className={cn("opacity-50 transition-all duration-200 ease-in-out", open ? "rotate-0" : "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: `${triggerWidth}px` }}>
        <Command>
          <CommandList>
            <CommandGroup>
              {categoryOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onSelect={(currentValue) => {
                    onCategoryChange(currentValue === selectedCategory ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedCategory === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
